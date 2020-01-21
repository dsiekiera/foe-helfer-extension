/*
 * **************************************************************************************
 *
 * Dateiname:                 infoboard.js
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

// Chat-Titel notieren
FoEproxy.addHandler('ConversationService', 'getEntities', (data, postData) => {
    MainParser.setConversations(data.responseData);
});

FoEproxy.addHandler('ConversationService', 'getTeasers', (data, postData) => {
    MainParser.setConversations(data.responseData);
});

FoEproxy.addHandler('ConversationService', 'getOverview', (data, postData) => {
    MainParser.setConversations(data.responseData);
});

/**
 *
 * @type {{init: Infoboard.init, InjectionLoaded: boolean, ResetBox: Infoboard.ResetBox, BoxContent: Infoboard.BoxContent, FilterInput: Infoboard.FilterInput, SoundFile: HTMLAudioElement, Box: Infoboard.Box, PlayInfoSound: null}}
 */
let Infoboard = {

    InjectionLoaded: false,
    PlayInfoSound: null,
    SoundFile: new Audio(extUrl + 'vendor/sounds/ping.mp3'),
    SavedFilter: ["auction", "gex", "guildfighs", "trade", "level", "message"],


    /**
     * Setzt einen ByPass auf den WebSocket und "hört" mit
     */
    init: () => {

        let StorageHeader = localStorage.getItem('ConversationsHeaders');

        // wenn noch nichts drin , aber im LocalStorage vorhanden, laden
        if (MainParser.Conversations.length === 0 && StorageHeader !== null) {
            MainParser.Conversations = JSON.parse(StorageHeader);
        }

        Infoboard.Box();

        if (Infoboard.InjectionLoaded === false) {
            FoEproxy.addRawWsHandler(data => {
                if ($('#BackgroundInfo').length > 0) {
                    Infoboard.BoxContent('in', data);
                }
            });
            Infoboard.InjectionLoaded = true;
        }
    },


    /**
     * Erzeugt die Box wenn noch nicht im DOM
     *
     */
    Box: () => {

        // Wenn die Box noch nicht da ist, neu erzeugen und in den DOM packen
        if ($('#BackgroundInfo').length === 0) {

            let spk = localStorage.getItem('infoboxTone');

            if (spk === null) {
                localStorage.setItem('infoboxTone', 'deactivated');
                Infoboard.PlayInfoSound = false;

            } else {
                Infoboard.PlayInfoSound = (spk !== 'deactivated');
            }

            if (localStorage.getItem("infoboxSavedFilter") === null)
                localStorage.setItem("infoboxSavedFilter", JSON.stringify(Infoboard.SavedFilter));
            else
                Infoboard.SavedFilter = JSON.parse(localStorage.getItem("infoboxSavedFilter"));

            HTML.Box({
                'id': 'BackgroundInfo',
                'title': i18n['Menu']['Info']['Title'],
                'auto_close': true,
                'dragdrop': true,
                'resize': true,
                'minimize': true,
                'speaker': 'infoboxTone'
            });

            // CSS in den DOM prügeln
            HTML.AddCssFile('infoboard');
        }

        let div = $('#BackgroundInfo'),
            h = [];

        // Filter
        h.push('<div class="filter-row">');

        h.push('<div class="dropdown">');
        h.push('<input type="checkbox" id="checkbox-toggle"><label class="dropdown-label game-cursor" for="checkbox-toggle">' + i18n['Boxes']['Infobox']['Filter'] + '</label><span class="arrow"></span>');

        h.push('<ul>');
        h.push('<li><label class="game-cursor"><input type="checkbox" data-type="auction" class="filter-msg game-cursor" ' + (Infoboard.SavedFilter.includes("auction") ? "checked" : "") + '> ' + i18n['Boxes']['Infobox']['FilterAuction'] + '</label></li>');
        h.push('<li><label class="game-cursor"><input type="checkbox" data-type="gex" class="filter-msg game-cursor" ' + (Infoboard.SavedFilter.includes("gex") ? "checked" : "") + '> ' + i18n['Boxes']['Infobox']['FilterGex'] + '</label></li>');
        h.push('<li><label class="game-cursor"><input type="checkbox" data-type="guildfighs" class="filter-msg game-cursor" ' + (Infoboard.SavedFilter.includes("guildfighs") ? "checked" : "") + '> ' + i18n['Boxes']['Infobox']['FilterGildFights'] + '</label></li>');
        h.push('<li><label class="game-cursor"><input type="checkbox" data-type="trade" class="filter-msg game-cursor" ' + (Infoboard.SavedFilter.includes("trade") ? "checked" : "") + '> ' + i18n['Boxes']['Infobox']['FilterTrade'] + '</label></li>');
        h.push('<li><label class="game-cursor"><input type="checkbox" data-type="level" class="filter-msg game-cursor" ' + (Infoboard.SavedFilter.includes("level") ? "checked" : "") + '> ' + i18n['Boxes']['Infobox']['FilterLevel'] + '</label></li>');
        h.push('<li><label class="game-cursor"><input type="checkbox" data-type="message" class="filter-msg game-cursor" ' + (Infoboard.SavedFilter.includes("message") ? "checked" : "") + '> ' + i18n['Boxes']['Infobox']['FilterMessage'] + '</label></li>');
        h.push('</ul>');
        h.push('</div>');

        h.push('<button class="btn btn-default btn-reset-box">' + i18n['Boxes']['Infobox']['ResetBox'] + '</button>');

        h.push('</div>');


        // Tabelle
        h.push('<table id="BackgroundInfoTable" class="foe-table">');

        h.push('<tbody></tbody>');

        h.push('</table>');

        div.find('#BackgroundInfoBody').html(h.join(''));

        div.show();

        Infoboard.FilterInput();
        Infoboard.ResetBox();

        $('body').on('click', '#infoboxTone', function() {

            let disabled = $(this).hasClass('deactivated');

            localStorage.setItem('infoboxTone', (disabled ? '' : 'deactivated'));
            Infoboard.PlayInfoSound = !!disabled;

            if (disabled === true) {
                $('#infoboxTone').removeClass('deactivated');
            } else {
                $('#infoboxTone').addClass('deactivated');
            }
        });
    },


    /**
     * Setzt eine neue Zeile für die Box zusammen
     *
     * @param dir
     * @param data
     */
    BoxContent: (dir, data) => {

        let Msg = data[0];

        if (Msg === undefined || Msg['requestClass'] === undefined) {
            return;
        }

        let c = Msg['requestClass'],
            m = Msg['requestMethod'],
            t = Msg['responseData']['type'] || '',
            s = c + '_' + m + t;

        // Gibt es eine Funktion dafür?
        if (Info[s] === undefined) {
            return;
        }

        let bd = Info[s](Msg['responseData']);

        if (bd === false) {
            return;
        }

        let status = $('input[data-type="' + bd['class'] + '"]').prop('checked'),
            tr = $('<tr />').addClass(bd['class']),
            msg = bd['msg'];


        // wenn nicht angezeigt werden soll, direkt versteckeln
        if (status === false) {
            tr.hide();
        }

        tr.append(
            '<td>' + bd['type'] + '<br><small><em>' + moment().format('HH:mm:ss') + '</em></small></td>' +
            '<td>' + msg + '</td>'
        );

        $('#BackgroundInfoTable tbody').prepend(tr);

        if (Infoboard.PlayInfoSound && status !== false) {
            Infoboard.SoundFile.play();
        }
    },


    /**
     * Filter für Message Type
     *
     */
    FilterInput: () => {
        $('body').on('change', '.filter-msg', function() {

            let active = [];

            $('.filter-msg').each(function() {
                if ($(this).is(':checked')) {
                    active.push($(this).data('type'));
                    if (!Infoboard.SavedFilter.includes($(this).data('type')))
                        Infoboard.SavedFilter.push($(this).data('type'));
                } else {
                    if (Infoboard.SavedFilter.includes($(this).data('type')))
                        Infoboard.SavedFilter.splice(Infoboard.SavedFilter.indexOf($(this).data('type')), 1);
                }
            });

            localStorage.setItem("infoboxSavedFilter", JSON.stringify(Infoboard.SavedFilter));

            $('#BackgroundInfoTable tbody tr').each(function() {
                let tr = $(this);
                type = tr.attr('class');

                if (active.includes(type)) {
                    tr.show();
                } else {
                    tr.hide();
                }
            });
        });
    },


    /**
     * Leert die Infobox, auf Wunsch
     *
     */
    ResetBox: () => {
        $('body').on('click', '.btn-reset-box', function() {
            $('#BackgroundInfoTable tbody').html('');
        });
    }
};


let Info = {

    /**
     * Cache zum "merken" der kampfenden Gilden
     */
    GildPoints: {},


    /**
     * Wenn ein LG gelevelt wurde, kommen die FPs einzeln zurück
     * und müssen gesammelt werden
     */
    ReturnFPPoints: 0,


    /**
     * Jmd hat in einer Auktion mehr geboten
     *
     * @param d
     * @returns {{class: 'auction', msg: string, type: string}}
     */
    ItemAuctionService_updateBid: (d) => {
        return {
            class: 'auction',
            type: 'Auktion',
            msg: HTML.i18nReplacer(
                i18n['Boxes']['Infobox']['Messages']['Auction'], {
                    'player': d['player']['name'],
                    'amount': HTML.Format(d['amount']),
                }
            )
        };
    },


    /**
     * Nachricht von jemandem
     *
     * @param d
     * @returns {{class: 'message', msg: string, type: string}}
     */
    ConversationService_getNewMessage: (d) => {
        let msg;

        if (d['text'] !== '') {
            msg = d['text'].replace(/(\r\n|\n|\r)/gm, '<br>');

        } else if (d['attachment'] !== undefined) {

            // LG
            if (d['attachment']['type'] === 'great_building') {
                msg = HTML.i18nReplacer(
                    i18n['Boxes']['Infobox']['Messages']['MsgBuilding'], {
                        'building': BuildingNamesi18n[d['attachment']['cityEntityId']]['name'],
                        'level': d['attachment']['level']
                    }
                )
            }
            // Handel
            else if (d['attachment']['type'] === 'trade_offer') {
                msg = d['attachment']['offeredAmount'] + ' ' + GoodsData[d['attachment']['offeredResource']]['name'] + ' &#187; ' + d['attachment']['neededAmount'] + ' ' + GoodsData[d['attachment']['neededResource']]['name'];
            }
        }

        return {
            class: 'message',
            type: 'Nachricht',
            msg: Info.GetConversationHeader(d['conversationId'], d['sender']['name']) + msg
        };
    },


    /**
     * FPs nach einem Level-Up notieren
     *
     * @param d
     */
    NoticeIndicatorService_getPlayerNoticeIndicators: (d) => {

        for (let i in d) {
            if (!d.hasOwnProperty(i)) {
                break;
            }

            // FP Typ aus dem Lager ermitteln
            let factor = parseInt(MainParser.Inventory.find(i => i['id'] === d[i]['itemId'])['item']['resource_package']['gain']),
                amount = factor * parseInt(d[i]['amount']);

            // ... und sichern
            Info.ReturnFPPoints += amount;
        }
    },


    /**
     * Auf der GG-Map kämpft jemand
     *
     * @param d
     * @returns {{msg: string, type: string, class: string}}
     */
    GuildBattlegroundService_getProvinces: (d) => {

        if (GildFights.SortedColors === null) {
            GildFights.PrepareColors();
        }

        let data = d[0];

        let bP = GildFights.MapData['battlegroundParticipants'],
            prov;

        if (data['id'] === 0) {
            prov = GildFights.ProvinceNames[0]['provinces'][0];
        } else {
            prov = GildFights.ProvinceNames[0]['provinces'].find(o => (o['id'] === data['id']));
        }

        if (data['lockedUntil'] !== undefined) {
            let p = bP.find(o => (o['participantId'] === d[0]['participantId']));

            let tc = GildFights.SortedColors[p['participantId']]['highlight'],
                ts = GildFights.SortedColors[p['participantId']]['shadow'];

            // 'Provinz <span style="color:#ffb539">' + prov['name'] + '</span> wurde von <span style="color:'+ tc + ';text-shadow: 0 1px 1px ' + ts +'">' + p['clan']['name'] + '</span> übernommen und ist bis ' + moment.unix(data['lockedUntil']).format('HH:mm:ss') +  ' Uhr gesperrt'

            return {
                class: 'guildfighs',
                type: i18n['Boxes']['Infobox']['FilterGildFights'],
                msg: HTML.i18nReplacer(
                    i18n['Boxes']['Infobox']['Messages']['GildFightOccupied'], {
                        provinceName: prov['name'],
                        attackerColor: tc,
                        attackerShadow: ts,
                        attackerName: p['clan']['name'],
                        untilOccupied: moment.unix(data['lockedUntil']).format('HH:mm:ss')
                    })
            };
        }

        let t = '';

        // Es wird gerade gekämpft
        for (let i in data['conquestProgress']) {
            if (!data['conquestProgress'].hasOwnProperty(i)) {
                break;
            }

            let d = data['conquestProgress'][i],
                p = bP.find(o => (o['participantId'] === d['participantId']));

            // es gibt mehrere Gilden in einer Provinz, aber eine kämpft gar nicht, überspringen
            if (Info.GildPoints[data['id']] !== undefined &&
                Info.GildPoints[data['id']][d['participantId']] !== undefined &&
                Info.GildPoints[data['id']][d['participantId']] === d['progress']) {

                continue;
            }

            let tc = GildFights.SortedColors[p['participantId']]['highlight'],
                ts = GildFights.SortedColors[p['participantId']]['shadow'];

            t += '<span style="color:' + tc + ';text-shadow: 0 1px 1px ' + ts + '">' + p['clan']['name'] + '</span> = <span style="color:#ffb539">' + prov['name'] + '</span> - <strong>' + d['progress'] + '</strong>/<strong>' + d['maxProgress'] + '</strong><br>';

            if (Info.GildPoints[data['id']] === undefined) {
                Info.GildPoints[data['id']] = {};
            }

            // mitschreiben um keine Punkte doppelt auszugeben
            Info.GildPoints[data['id']][d['participantId']] = d['progress'];
        }

        return {
            class: 'guildfighs',
            type: i18n['Boxes']['Infobox']['FilterGildFights'],
            msg: t
        };
    },


    /**
     * LG wurde gelevelt
     *
     * @param d
     * @returns {{class: 'level', msg: string, type: string}}
     */
    OtherPlayerService_newEventgreat_building_contribution: (d) => {
        debugger;
        let newFP = Info.ReturnFPPoints;

        // zurück setzen
        Info.ReturnFPPoints = 0;

        return {
            class: 'level',
            type: 'Level-Up',
            msg: HTML.i18nReplacer(
                i18n['Boxes']['Infobox']['Messages']['LevelUp'], {
                    player: d['other_player']['name'],
                    building: d['great_building_name'],
                    level: d['level'],
                    rank: d['rank'],
                    fps: newFP
                }
            )
        };
    },


    /**
     * Handel wurde angenommen
     *
     * @param d
     * @returns {{class: 'trade', msg: string, type: string}}
     */
    OtherPlayerService_newEventtrade_accepted: (d) => {
        return {
            class: 'trade',
            type: i18n['Boxes']['Infobox']['FilterTrade'],
            msg: HTML.i18nReplacer(
                i18n['Boxes']['Infobox']['Messages']['Trade'], {
                    'player': d['other_player']['name'],
                    'offer': GoodsData[d['offer']['good_id']]['name'],
                    'offerValue': d['offer']['value'],
                    'need': GoodsData[d['need']['good_id']]['name'],
                    'needValue': d['need']['value']
                }
            )
        }
    },


    /**
     * Ein Gildenmitglied hat in der GEX gekämpft
     *
     * @param d
     * @returns {boolean|{msg: *, type: string, class: string}}
     */
    GuildExpeditionService_receiveContributionNotification: (d) => {

        // "mich" nicht anzeigen
        if (d['player']['player_id'] === ExtPlayerID) {
            return false;
        }

        return {
            class: 'gex',
            type: 'GEX',
            msg: HTML.i18nReplacer(
                i18n['Boxes']['Infobox']['Messages']['GEX'], {
                    'player': d['player']['name'],
                    'points': HTML.Format(d['expeditionPoints'])
                }
            )
        };
    },


    /**
     * Sucht den Titel einer Nachricht heraus
     *
     * @param id
     * @param {string} name
     * @returns {string}
     */
    GetConversationHeader: (id, name) => {
        if (MainParser.Conversations.length > 0) {
            let header = MainParser.Conversations.find(obj => (obj['id'] === id));

            if (header !== undefined) {
                return '<div><strong style="color:#ffb539">' + header['title'] + '</strong> - <em>' + name + '</em></div>';
            }
        } else {
            return '<div><strong style="color:#ffb539">' + name + '</strong></div>';
        }

        return '';
    }
};