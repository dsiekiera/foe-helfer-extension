/*
 * **************************************************************************************
 *
 * Dateiname:                 part-calc.js
 * Projekt:                   foe-chrome
 *
 * erstellt von:              Daniel Siekiera <daniel.siekiera@gmail.com>
 * erstellt am:	              22.12.19, 14:31 Uhr
 * zuletzt bearbeitet:       22.12.19, 14:31 Uhr
 *
 * Copyright © 2019
 *
 * **************************************************************************************
 */

let Parts = {

	CurrentBuildingID : false,
	CurrentBuildingStep : false,
    CurrentBuildingPercents: [90, 90, 90, 90, 90],
    Input: [],
	SaveCopy: [],


	/**
	 * HTML Box in den DOM drücken und ggf. Funktionen binden
	 */
	buildBox: ()=> {

		// Gibt es schon? Raus...
		if( $('#OwnPartBox').length > 0 ){
			return;
		}

		// prüfen ob es hinterlegte Werte gibt
		let perc = localStorage.getItem('CurrentBuildingPercentArray');

		// Array zurück holen
		if(perc !== null){
			Parts.CurrentBuildingPercents = JSON.parse(perc);
		}

		// Box in den DOM
		HTML.Box({
			'id': 'OwnPartBox',
			'title': i18n['Boxes']['OwnpartCalculator']['Title'],
			'ask': i18n['Boxes']['OwnpartCalculator']['HelpLink'],
			'auto_close': true,
			'dragdrop': true,
			'minimize': true
		});

		// CSS in den DOM prügeln
		HTML.AddCssFile('part-calc');

		// Body zusammen fummeln
		Parts.BoxBody();

		// Für einen Platz wurde der Wert geändert, alle durchsteppen, übergeben und sichern
		$('body').on('blur', '.arc-percent-input', function(){
			let aprc = [];

			$('.arc-percent-input').each(function(){
				aprc.push($(this).val() );
			});

			Parts.CurrentBuildingPercents = aprc;
            localStorage.setItem('CurrentBuildingPercentArray', JSON.stringify(aprc));

            Parts.collectExternals();
		});


		// Es wird ein externer Platz eingetragen
		$('body').on('blur', '.ext-part-input', function(){
			Parts.collectExternals();
		});


		// eine neuer globaler Arche-Satz wird gewählt
		$('body').on('click', '.btn-set-arc', function(){
			let a = $(this).data('value');

			for(let i = 0; i < 5; i++)
			{
				Parts.CurrentBuildingPercents[i] = a;
				$('.arc-percent-input').eq(i).val(a);
			}

			localStorage.setItem('CurrentBuildingPercentArray', JSON.stringify(Parts.CurrentBuildingPercents));

			Parts.collectExternals();
		});
	},


	/**
	 * Externe Plätze einsammeln und ggf. übergeben
	 */
	collectExternals: ()=> {
        $('.ext-part-input').each(function(i){

			let v = $(this).val();

            if (v === '') {
				$(this).val(0);
				v = 0;
			}
            
            Parts.Input[i] = parseInt(v);
		});
        
		// Prüfen ob alle "null" sind
		const isAllZero = !Parts.Input.some(el => el.value !== 0);

		if(isAllZero !== true){
			Parts.BoxBody(Parts.Input);
		} else {
			Parts.BoxBody();
		}
	},


	/**
	 * Sichtbarer Teil
	 *
	 * @param input
	 */
	BoxBody: (input)=> {

        let d = JSON.parse(localStorage.getItem('OwnCurrentBuildingCity')),
            rankings = JSON.parse(localStorage.getItem('OwnCurrentBuildingGreat')),
            IsPreviousLevel = (localStorage.getItem('OwnCurrentBuildingPreviousLevel') === "true"),
            cityentity_id = d['cityentity_id'],
            level = d['level'],
            arcs = [],
            FPRewards = [], // FP Maezenboni pro Platz (0 basiertes Array)
            MedalRewards = [], // Medaillen Maezenboni pro Platz (0 basiertes Array)
            BPRewards = [], // Blaupause Maezenboni pro Platz (0 basiertes Array)
            h = [],
            EigenStart = 0, // Bereits eingezahlter Eigenanteil (wird ausgelesen)
            Eigens = [], // Feld aller Eigeneinzahlungen pro Platz (0 basiertes Array)
            Dangers = [0, 0, 0, 0, 0], // Feld mit Dangerinformationen. Wenn > 0, dann die gefährdeten FP
            Maezens = [], // Feld aller Fremdeinzahlungen pro Platz (0 basiertes Array)
            LeveltLG = [false, false, false, false, false],
            Total = parseInt(d['state']['forge_points_for_level_up']), // Gesamt FP des aktuellen Levels
            MaezenTotal = 0, // Summe aller Fremdeinzahlungen
            EigenTotal, // Summe aller Eigenanteile
            ExtTotal = 0, // Summe aller Externen Einzahlungen
            EigenCounter = 0, // Eigenanteile Counter während Tabellenerstellung
            Rest = Total, // Verbleibende FP: Counter während Berechnung
            NonExts = [false, false, false, false, false]; // Wird auf true gesetz, wenn auf einem Platz noch eine (nicht externe) Zahlung einzuzahlen ist (wird in Spalte Einzahlen angezeigt)


        Parts.CurrentBuildingID = cityentity_id;
        if (IsPreviousLevel) {
            Total = 0;
            for (let i = 0; i < rankings.length; i++) {
                let ToAdd = rankings[i]['forge_points'];
                if (ToAdd !== undefined) Total += ToAdd;
            }
            Rest = Total;
        }

        if (level === undefined) {
            level = 0;
        }

        for (let i = 0; i < 5; i++) {
            arcs[i] = ((parseFloat(Parts.CurrentBuildingPercents[i]) + 100) / 100);
        }
        
        // Wenn in Rankings nichts mehr steht, dann abbrechen
        for (let i = 0; i < rankings.length; i++) {
            if (rankings[i]['rank'] === undefined || rankings[i]['rank'] < 0) { //undefined => Eigentümer oder gelöscher Spieler P1-5, -1 => gelöschter Spieler ab P6 abwärts
                EigenStart = rankings[i]['forge_points'];
                Rest -= EigenStart;
                continue;
            }

            let Place = rankings[i]['rank'] - 1,
				MedalCount = 0;

            Maezens[Place] = rankings[i]['forge_points'];
            if (Maezens[Place] === undefined) Maezens[Place] = 0;

			if (Place < 5) {
				if (rankings[i]['reward'] !== undefined) {
					let FPCount = (rankings[i]['reward']['strategy_point_amount'] !== undefined ? parseInt(rankings[i]['reward']['strategy_point_amount']) : 0);
					FPRewards[Place] = Math.round(FPCount * arcs[Place]);
					if (FPRewards[Place] === undefined) FPRewards[Place] = 0;

					// Medallien berechnen
					MedalCount = (rankings[i]['reward']['resources'] !== undefined ? parseInt(rankings[i]['reward']['resources']['medals']) : 0);
					MedalRewards[Place] = Math.round(MedalCount * arcs[Place]);
					if (MedalRewards[Place] === undefined) MedalRewards[Place] = 0;

					// Blaupausen berechnen
					let BlueprintCount = (rankings[i]['reward']['blueprints'] !== undefined ? parseInt(rankings[i]['reward']['blueprints']) : 0);
					BPRewards[Place] = Math.round(BlueprintCount * arcs[Place]);
					if (BPRewards[Place] === undefined) BPRewards[Place] = 0;
				}
				else {
					FPRewards[Place] = 0;
					MedalRewards[Place] = 0;
					BPRewards[Place] = 0;
				}
            }
        }

        //Vorheriges Level und Platz nicht belegt => Wird nicht mitgesendet daher mit 0 füllen
        for (let i = Maezens.length; i < 5; i++) {
			Maezens[i] = 0;
			FPRewards[i] = 0;
			MedalRewards[i] = 0;
			BPRewards[i] = 0;
        }

        if (input !== undefined) {
            for (let i = 0; i < input.length; i++) {
                if (input[i] > 0) {
                    Maezens[Maezens.length] = input[i];
                }
            }
        }
               
        Maezens.sort(function (a, b) { return b - a });

        for (let i = 0; i < Maezens.length; i++) {
            if (Maezens[i] === 0) {
                Maezens.length = Math.max(i, 5);
                break;
            }
                        
            ExtTotal += Maezens[i];
        }

        Rest -= ExtTotal;
        
        for (let i = 0; i < 5; i++) {
            if (FPRewards[i] <= Maezens[i] || Rest <= Maezens[i]) {
                Eigens[i] = 0;
                continue;
            }

            Eigens[i] = Math.ceil(Rest + Maezens[i] - 2 * FPRewards[i]);
            if (Eigens[i] < 0) {
                Dangers[i] = Math.floor(0 - Eigens[i]/2);
                Eigens[i] = 0;
            }
            
            for (let j = Maezens.length - 1; j >= i; j--) {
                if (Maezens[j] > 0) {
                    Maezens[j + 1] = Maezens[j];
                }
            }
            Maezens[i] = FPRewards[i];
            if (Maezens[i] >= Rest) {
                LeveltLG[i] = true;
                if (Dangers[i] > 0)
                    Dangers[i] -= Maezens[i] - Rest;
                Maezens[i] = Rest;
            }
            NonExts[i] = true;
            MaezenTotal += Maezens[i];
            Rest -= Eigens[i] + Maezens[i];
        }

        if(Rest>0) Eigens[5] = Rest;
        
        EigenTotal = EigenStart;
        for (let i = 0; i < Eigens.length; i++) {
            EigenTotal += Eigens[i];
        }      

        for (let i = FPRewards.length; i < Maezens; i++)
            FPRewards[i] = 0;

        for (let i = MedalRewards.length; i < Maezens; i++)
            MedalRewards[i] = 0;

        for (let i = BPRewards.length; i < Maezens; i++)
            BPRewards[i] = 0;
        
        // Info-Block
        h.push('<table style="width: 100%"><tr><td style="width: 50%">');
        h.push('<p class="lg-info text-center"><strong>' + BuildingNamesi18n[cityentity_id]['name'] + ' </strong><br>' + (IsPreviousLevel ? i18n['Boxes']['OwnpartCalculator']['OldLevel'] : i18n['Boxes']['OwnpartCalculator']['Step'] + ' ' + level + ' &rarr; ' + (parseInt(level) + 1)) + '</p>');
        h.push('</td>');
        h.push('<td class="text-right">');
        h.push('<button class="btn btn-default' + ( Parts.CurrentBuildingPercents[0] === 85 ? ' btn-default-active' : '') + ' btn-set-arc" data-value="85">85%</button>');
		h.push('<button class="btn btn-default' + (Parts.CurrentBuildingPercents[0] === 90 ? ' btn-default-active' : '') + ' btn-set-arc" data-value="90">90%</button>');
        h.push('</td>');
        h.push('</tr></table>');

        h.push('<table class="foe-table" style="margin-bottom: 10px;">');

        h.push('<thead>');

        h.push('<tr>');
        h.push('<th class="text-center" colspan="3" style="width: 50%">' + i18n['Boxes']['OwnpartCalculator']['PatronPart'] + ': <strong>' + (MaezenTotal + ExtTotal) + '</strong></th>');
        h.push('<th class="text-center" colspan="3">' + i18n['Boxes']['OwnpartCalculator']['OwnPart'] + ': <strong class="success">' + EigenTotal + '</strong></th>');
        h.push('</tr>');

        h.push('<tr>');
        if (EigenStart > 0) {
            h.push('<th colspan="3" class="text-center" style="width: 50%">' + i18n['Boxes']['OwnpartCalculator']['LGTotalFP'] + ': <strong class="normal">' + Total + '</strong></th>');
            h.push('<th colspan="3" class="text-center">' + i18n['Boxes']['OwnpartCalculator']['OwnPartRemaining'] + ': <strong class="success">' + (EigenTotal - EigenStart) + '</strong></th>');
        }
        else {
            h.push('<th colspan="6" class="text-center">' + i18n['Boxes']['OwnpartCalculator']['LGTotalFP'] + ': <strong class="normal">' + Total + '</strong></th>');
        }

        h.push('</tr>');

        h.push('</thead>');
        h.push('</table>');

        h.push('<table id="OwnPartTable" class="foe-table">');
        h.push('<tbody>');

        h.push('<tr>');
        h.push('<td>' + i18n['Boxes']['OwnpartCalculator']['Order'] + '</td>');
        h.push('<td class="text-center">' + i18n['Boxes']['OwnpartCalculator']['Deposit'] + '</td>');
        h.push('<td class="text-center">' + i18n['Boxes']['OwnpartCalculator']['Done'] + '</td>');
		h.push('<td class="text-center">' + i18n['Boxes']['OwnpartCalculator']['BPs'] + '</td>');
		h.push('<td class="text-center">' + i18n['Boxes']['OwnpartCalculator']['Meds'] + '</td>');
		h.push('<td class="text-center">' + i18n['Boxes']['OwnpartCalculator']['Ext'] + '</td>');
		h.push('<td class="text-center">' + i18n['Boxes']['OwnpartCalculator']['Arc'] + '</td>');
        h.push('</tr>');

        for (let i = 0; i < 5; i++) {
            EigenCounter += Eigens[i];
            if (i === 0 && EigenStart > 0) {
                EigenCounter += EigenStart;

                h.push('<tr>');
                h.push('<td>' + i18n['Boxes']['OwnpartCalculator']['OwnPart'] + '</td>');
                h.push('<td class="text-center"><strong class="success">' + (Eigens[i]>0 ? Eigens[i] + ' <small>(=' + (Eigens[i] + EigenStart) + ')</small>' : '-') + '</strong></td>');
                h.push('<td class="text-center"><strong class="info">' + EigenStart + '</strong></td>');
                h.push('<td colspan="4"></td>');
                h.push('</tr>');
            }
            else {
                if (Eigens[i] > 0) {
                    h.push('<tr>');
                    h.push('<td>' + i18n['Boxes']['OwnpartCalculator']['OwnPart'] + '</td>');
                    h.push('<td class="text-center"><strong class="success">' + Eigens[i] + (EigenCounter > Eigens[i] ? ' <small>(=' + EigenCounter + ')</small>' : '') + '</strong></td>');
                    h.push('<td colspan="5"></td>');
                    h.push('</tr>');
                }
            }

            h.push('<tr>');
            h.push('<td>' + i18n['Boxes']['OwnpartCalculator']['Place'] + ' ' + (i+1) + '</td>');

            if (NonExts[i]) {
                h.push('<td class="text-center"><strong>' + (Maezens[i] > 0 ? Maezens[i] : '-') + '</strong >' + '</td>');
                if (LeveltLG[i]) {
                    h.push('<td class="text-center"><strong class="error">levelt</strong></td>');
                }
                else if (Dangers[i] > 5) {
                    h.push('<td class="text-center"><strong class="error">danger (' + (Dangers[i]) + 'FP)</strong></td>');
                }
                else {
                    h.push('<td class="text-center"><strong class="info">-</strong></td>');
                }
            }
            else {
                h.push('<td class="text-center"><strong>-</strong></td>');
                let MaezenString = Maezens[i] > 0 ? Maezens[i] : '-';
                let MaezenDiff = Maezens[i] - FPRewards[i];
                let MaezenDiffString = '';
                if (Maezens[i] > 0) {
                    if (MaezenDiff > 0) {
                        MaezenDiffString = ' <strong class="success"><small>(+' + MaezenDiff + ')</small></strong>';
                    }
                    else if (MaezenDiff < 0) {
                        MaezenDiffString = ' <strong class="error"><small>(' + MaezenDiff + ')</small></strong>';
                    }
                }

                h.push('<td class="text-center"><strong class="info">' + MaezenString + '</strong>' + MaezenDiffString + '</td>');
            }

            h.push('<td class="text-center">' + BPRewards[i] + '</td>');
            h.push('<td class="text-center">' + HTML.Format(MedalRewards[i]) + '</td>');
            h.push('<td class="text-center"><input min="0" step="1" type="number" class="ext-part-input" value="' + (input !== undefined ? Parts.Input[i] : 0) + '"></td>');
            h.push('<td class="text-center"><input type="number" class="arc-percent-input" step="0.1" min="12" max="200" value="' + Parts.CurrentBuildingPercents[i] + '"></td>');

            h.push('</tr>');
        }

        let MaezenRest = 0;
        for (let i = 5; i < Maezens.length; i++) {
            MaezenRest += Maezens[i];
        }

        //Bestehende Einzahlungen, die aus den P5 raus geschoben wurden
        if (MaezenRest > 0) {
            h.push('<tr>');
            h.push('<td>' + i18n['Boxes']['OwnpartCalculator']['Place'] + ' 6' + (Maezens.length > 6 ? ('-' + Maezens.length) : '') + '</td>');
            h.push('<td class="text-center">-</td>');
            h.push('<td class="text-center"><strong class="info">' + MaezenRest + '</strong></td>');
            h.push('<td colspan="4"></td>');
            h.push('</tr>');
        }

        //Restzahlung
        if (Eigens[5] > 0) {
            EigenCounter += Eigens[5];

            h.push('<tr>');
            h.push('<td>' + i18n['Boxes']['OwnpartCalculator']['OwnPart'] + '</td>');
            h.push('<td class="text-center"><strong class="success">' + Eigens[5] + (EigenCounter > Eigens[5] ? ' <small>(=' + EigenCounter + ')</small>' : '') + '</strong></td>');
            h.push('<td colspan="5"></td>');
            h.push('</tr>');
        }
        
        h.push('<tbody>');
        h.push('</table>');

        Parts.BuildBackgroundBody(Maezens, Eigens, NonExts);

        // Wieviel fehlt noch bis zum leveln?
        if (IsPreviousLevel === false) {
            let rest = (d['state']['invested_forge_points'] === undefined ? d['state']['forge_points_for_level_up'] : d['state']['forge_points_for_level_up'] - d['state']['invested_forge_points']);
            h.push('<div class="text-center" style="margin-top:5px;margin-bottom:5px;"><em>' + i18n['Boxes']['Calculator']['Up2LevelUp'] + ': <span id="up-to-level-up" style="color:#FFB539">' + HTML.Format(rest) + '</span> ' + i18n['Boxes']['Calculator']['FP'] + '</em></div>');
        }

		h.push(Calculator.GetRecurringQuestsLine());

		$('#OwnPartBoxBody').html( h.join('') );
	},


	/**
	 * Daten für die Kopierbuttons
	 *
	 * @param Maezens
	 * @param Eigens
	 * @param NonExts
	 */
	BuildBackgroundBody: (Maezens, Eigens, NonExts)=>{
		let b = [],
			n = localStorage.getItem(ExtPlayerID+'_PlayerCopyName'),
			m = localStorage.getItem(ExtPlayerID+'_current_player_name'),
			s = localStorage.getItem('DropdownScheme'),
			bn = localStorage.getItem(Parts.CurrentBuildingID);

		b.push('<p><span class="header"><strong>' + i18n['Boxes']['OwnpartCalculator']['CopyValues'] + '</strong></span></p>');

		b.push('<div><span>Spieler:</span><input type="text" id="player-name" placeholder="' + i18n['Boxes']['OwnpartCalculator']['YourName'] + '" value="' + (n !== null ? n : m) + '"></div>');
		b.push('<div><span>Gebäude:</span><input type="text" id="build-name" placeholder="' + i18n['Boxes']['OwnpartCalculator']['IndividualName'] + '"  value="' + (bn !== null ? bn : BuildingNamesi18n[ Parts.CurrentBuildingID ]['name']) + '"></div>');

		let drp = '<div><span>Schema:</span><select id="chain-scheme">' +
			'<option value="" disabled>-- ' + i18n['Boxes']['OwnpartCalculator']['OutputScheme'] + ' --</option>' +
			'<option value="1"' + (s === '1' ? ' selected' : '') + '>Name LG P5 P4 P3 P2 P1</option>' +
			'<option value="2"' + (s === '2' ? ' selected' : '') + '>Name LG P1 P2 P3 P4 P5</option>' +
			'<option value="3"' + (s === '3' ? ' selected' : '') + '>Name LG P5/4/3/2/1</option>' +
			'<option value="4"' + (s === '4' ? ' selected' : '') + '>Name LG P1/2/3/4/5</option>' +
            '<option value="5"' + (s === '5' ? ' selected' : (s === null ? ' selected' : '')) + '>Name LG P5(FP) P4(FP) P3(FP) P2(FP) P1(FP)</option>' +
            '<option value="6"' + (s === '6' ? ' selected' : '' ) + '>Name LG P1(FP) P2(FP) P3(FP) P4(FP) P5(FP)</option>' +
            '</select></div>';

        b.push(drp);

        let cb = '<div class="checkboxes">' +
            '<label class="form-check-label" for="chain-auto"><input type="checkbox" id="chain-auto" data-place="0" checked> ' + i18n['Boxes']['OwnpartCalculator']['Auto'] + '</label>' +

			'<label class="form-check-label" for="chain-p1"><input type="checkbox" id="chain-p1" data-place="1"> ' + i18n['Boxes']['OwnpartCalculator']['Place'] + ' 1</label>' +

			'<label class="form-check-label" for="chain-p2"><input type="checkbox" class="form-check-input chain-place" id="chain-p2" data-place="2"> ' + i18n['Boxes']['OwnpartCalculator']['Place'] + ' 2</label>' +

			'<label class="form-check-label" for="chain-p3"><input type="checkbox" class="form-check-input chain-place" id="chain-p3" data-place="3"> ' + i18n['Boxes']['OwnpartCalculator']['Place'] + ' 3</label>' +

			'<label class="form-check-label" for="chain-p4"><input type="checkbox" class="form-check-input chain-place" id="chain-p4" data-place="4"> ' + i18n['Boxes']['OwnpartCalculator']['Place'] + ' 4</label>' +

			'<label class="form-check-label" for="chain-p5"><input type="checkbox" class="form-check-input chain-place" id="chain-p5" data-place="5"> ' + i18n['Boxes']['OwnpartCalculator']['Place'] + ' 5</label>' +

			'<label class="form-check-label" for="chain-level"><input type="checkbox" class="form-check-input chain-place" id="chain-level" data-place="level"> ' + i18n['Boxes']['OwnpartCalculator']['Levels'] + '</label>' +
			'</div>';

		b.push(cb);

		b.push('<div class="btn-outer text-center" style="margin-top: 10px">' +
				'<span class="btn-default button-own">' + i18n['Boxes']['OwnpartCalculator']['CopyValues'] + '</span> ' +
				'<span class="btn-default button-save-own">' + i18n['Boxes']['OwnpartCalculator']['Note'] + '</span>' +
			'</div>');

		// ---------------------------------------------------------------------------------------------
		$('body').off("click",'.button-own');
		$('body').on('click', '.button-own', function(){
			let copyParts = Parts.CopyFunction(Maezens, Eigens, NonExts, $(this), 'copy');
			helper.str.copyToClipboard(copyParts);
		});
		$('body').off("click",'.button-save-own');
		$('body').on('click', '.button-save-own', function(){
			Parts.CopyFunction(Maezens, Eigens, NonExts, $(this), 'save');
		});


		// Box wurde schon in den DOM gelegt?
		if( $('.OwnPartBoxBackground').length > 0 ){
			$('.OwnPartBoxBackgroundBody').html( b.join('') );

			// und raus...
			return;
		}

		// Container zusammen setzen
		let div = $('<div />').addClass('OwnPartBoxBackground'),
			a = $('<div />').addClass('outerArrow').append( $('<span />').addClass('arrow game-cursor') ).append( $('<div />').addClass('OwnPartBoxBackgroundBody window-box').append(b.join('')) );

		$('#OwnPartBox').append( div.append(a) );

		$('#OwnPartBox').append( $('<div />').addClass('black-bg').hide() );

		// der "Toogle"-Pfeil wurde geklickt,
		// lasst die Spiele beginnen
		$('.arrow').bind('click', function(){
			if( $('#OwnPartBox').hasClass('show') ){
				Parts.BackGroundBoxAnimation(false);
			} else {
				Parts.BackGroundBoxAnimation(true);
			}
		});
	},


	/**
	 * Ausgeben oder Merken
	 *
	 * @param Maezens
	 * @param Eigens
	 * @param NonExts
	 * @param Event
	 * @param Action
	 * @returns {string}
	 */
	CopyFunction: (Maezens, Eigens, NonExts, Event, Action)=> {

		let pn = $('#player-name').val(),
			bn = $('#build-name').val(),
			cs = $('#chain-scheme').val();

		localStorage.setItem(ExtPlayerID+'_PlayerCopyName', pn);
		localStorage.setItem(Parts.CurrentBuildingID, bn);

		// Schema speichern
		localStorage.setItem('DropdownScheme', cs);

		$(Event).addClass('btn-green');

		// nach 1,75s den grünen Rahmen wieder ausblenden
		setTimeout(function(){
			$(Event).removeClass('btn-green');

			// wieder zuklappen
			Parts.BackGroundBoxAnimation(false);
		}, 1750);


		let sol = {
				1: 'Pi',
				2: 'Pi',
				3: '/i',
				4: '/i',
				5: 'Pi(fp)',
				6: 'Pi(fp)',
			},
			sop = {
				1: {d: 'd'},
				2: {d: 'u'},
				3: {d: 'd'},
				4: {d: 'u'},
				5: {d: 'd'},
				6: {d: 'u'}
			};

		let parts = [];

		// Spieler Name
		parts.push(pn);

		// LG Name
		parts.push(bn);

		if( $('#chain-level').prop('checked') ){
			parts.push('Bitte Leveln');
		}

		let PrintPlace = [false, false, false, false, false];
		let NoPlaceSafe = false;

		// automatisch ermitteln
		if ($('#chain-auto').prop('checked')) {
			NoPlaceSafe = true;

			for (let i = 0; i < 5; i++) {
				if (Eigens[i] > 0)
					break;
				if (NonExts[i]) {
					PrintPlace[i] = true;
					NoPlaceSafe = false;
				}
			}
		}
		// einzelne Plätze wurde angehakt
		else {
			for (let i = 0; i < 5; i++) {
				if ($('#chain-p' + (i+1)).prop('checked'))
					PrintPlace[i] = true;
			}
		}

		// Plätze formatieren
		if (!NoPlaceSafe) {
			if (sop[cs]['d'] === 'u') {
				for (let i = 0; i < 5; i++) {
					if (PrintPlace[i]) {
						let p = sol[cs].replace(/i/, (i + 1));
						p = p.replace(/fp/, Maezens[i]);
						parts.push(p);
					}
				}

			} else { //NoPlaceSafe
				for (let i = 5 - 1; i >= 0; i--) {
					if (PrintPlace[i]) {
						let p = sol[cs].replace(/i/, (i + 1));
						p = p.replace(/fp/, Maezens[i]);
						parts.push(p);
					}
				}
			}
		}
		else {
			parts.push(i18n['Boxes']['OwnpartCalculator']['NoPlaceSafe']);
		}

		if(Parts.SaveCopy.length > 0){
			for(let i = 0; i < Parts.SaveCopy.length; i++)
			{
				// prüfen ob dieses LG mit diesem Namen schon enthalten ist, löschen
				if(Parts.SaveCopy[i].indexOf(bn) > -1)
				{
					// raus löschen
					Parts.SaveCopy.splice(i, 1);
				}
			}
		}

		// wenn dieser Wert noch nicht im Array liegt...
		if(Parts.SaveCopy.includes(parts.join(' ')) === false){
			Parts.SaveCopy.push(parts.join(' '));
		}

		// Nur wenn "Kopieren" etwas ausgeben
		if(Action === 'copy')
		{
			let copy = Parts.SaveCopy.join('\n');

			// wieder leer machen
			Parts.SaveCopy = [];

			return copy;
		}
	},


	/**
	 * Lecker Animation für das Anzeigen der Kopieren Buttons
	 *
	 * @param show
	 */
	BackGroundBoxAnimation: (show)=> {
		let $box = $('#OwnPartBox');


		if(show === true){
			let e = /** @type {HTMLElement} */ (document.getElementsByClassName('OwnPartBoxBackgroundBody')[0]);
			e.style.height = 'auto';
			let h = e.offsetHeight;
			e.style.height = '0px';

			$('.OwnPartBoxBackgroundBody').animate({height: h, opacity: 1}, 250, function () {
				$box.addClass('show');
				$box.find('.black-bg').show();
			});

		} else {
			$('.OwnPartBoxBackgroundBody').animate({height: 0, opacity: 0}, 250, function () {
				$box.removeClass('show');
				$box.find('.black-bg').hide();
			});
		}
	},


	/**
	 * Die Box ist schon offen, Content updaten
	 *
	 */
	RefreshData: ()=> {
		Parts.BoxBody();
	},
};
