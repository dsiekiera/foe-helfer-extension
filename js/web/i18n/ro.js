/*
 * **************************************************************************************
 *
 * Dateiname:                 ro.js
 * Projekt:                   foe-chrome
 *
 * erstellt von:              Daniel Siekiera <daniel.siekiera@gmail.com>
 * erstellt am:	              17.12.19, 22:44 Uhr
 * zuletzt bearbeitet:       17.12.19, 22:18 Uhr
 *
 * Copyright © 2019
 *
 * **************************************************************************************
 */

let i18n = {
	"Local" : "ro-RO",
	"DateTime" : "D/M/YY h:mm:ss a",

	"Boxes" : {
		"OwnpartCalculator" : {
			"Title": "Calculator de contribuție proprie",
			"HelpLink": "https://foe-rechner.de/extension/index#Eigenanteilsrechner",
            "Step": "Nivel",
            "OldLevel": "Nivelul anterior",
			"PatronPart": "Contribuția externă",
			"OwnPart": "Contribuția proprie",
            "LGTotalFP": "Total PF nivel",
            "OwnPartRemaining": "Rest de depus",
			"Done": "Depus",
			"BPs": "Planuri",
			"Meds": "Medalii",
			"Ext": "Ext",
			"Arc": "Arc",
			"Order": "Locuri",
			"Deposit": "Depozit",
			"CopyValues": "Copiază valorile",
			"Note": "Notă",
			"YourName": "Numele tău",
			"IndividualName": "Denumire CL",
			"OutputScheme": "Șablon",
            "Auto": "Auto",
            "Place": "Locul",
            "Levels": "Toate locurile",
            "NoPlaceSafe": "Nici un loc nu este asigurat"
		},

		"Calculator": {
			"Title": "Calculator costuri",
			"HelpLink": "https://foe-rechner.de/extension/index#Kostenrechner",
			"Step": "Nivelul",
			"AvailableFP": "PF disponibile",
			"ArcBonus": "Bonusul Domului",
			"Earnings": "Recompensă",
			"Rate": "Procent",
			"Up2LevelUp": "PF rămase până la închidere",
			"FP": "PF",
			"Save": "Salvat",
			"Commitment": "Cost",
			"Profit": "Profit",
			"LevelWarning": "ATENȚIE! Închide nivelul la CL!",
			"NoFPorMedsAvailable": "PF sau planuri indisponibile",
			"LGNotOpen": "Următorul nivel nu este deblocat",
			"LGNotConnected": "Clădirea nu este conectată la stradă",
			"ActiveRecurringQuest": "Misiunea repetitivă actuală:",
			"Done": "Terminat"
		},

		"LGOverviewBox": {
			"Title": "Contribuții posibile",
			"Tooltip": {
				"FoundNew": "nou găsit",
				"FoundAgain": "recunoscut",
				"NoPayment": "nici o contribuție",
			},
			"Building": "Clădire",
			"Level": "Nivel",
			"PayedTotal": "Depus / Total",
			"Rate": "Procent",
			"Profit": "Profit",
			"NothingToGet": "<strong>__player__</strong> nu are nici o clădire vulnerabilă"
		},

		"StrategyPoints" : {
			"Title" : "Producția de PF-uri",
			"TotalFPs": "Total PF-uri de la clădiri: ",
			"Amount": "Număr",
			"FPBar" : "PF în inventar: "
		},

		"Productions" : {
			"Title" : "Prezentarea generală a producției",
			"SearchInput": "Caută clădirea...",
			"Total" : "Total: ",
			"ModeGroups": "Grupare",
			"ModeSingle": "Extindere",
			"Happiness": "Fericre",
			"AdjacentBuildings": "Clădiri învecinate",
			"Headings" : {
				"number" : "Număr",
				"amount" : "Cantitate",
				"earning" : "Recoltare",
				"greatbuilding" : "Clădiri legendare",
				"production" : "Clădiri de producție",
				"random_production" : "Producție aleatorie",
				"residential": "Clădiri speciale",
				"decoration": "Decorațiuni",
				"street": "Străzi",
				"goods": "Clădiri de bunuri",
				"culture": "Clădiri culturale",
				"main_building": "Primărie",
				"boost": "Boost", // TODO: to be translated
				"all" : "Total"
			}
		},

		"Neighbors" : {
			"Title" : "Producție de ",
			"ReadyProductions" : "Producții finalizate",
			"OngoingProductions" : "Producții în curs"
		},

		"Outpost" : {
			"Title" : "Bunurile din așezarea culturală",
			"TitleShort" : "Sumar bunuri - ",
			"TitleBuildings" : "Clădire",
			"TitleFree" : "Deblocat",
			"DescRequired" : "Necesar",
			"DescInStock" : "Disponibil",
			"DescStillMissing" : "<span style='color:#29b206'>Surplus</span> / <span style='color:#ef1616'>Lipsă</span>",
			"ExpansionsSum" : "Expansiune", 
			"nextTile" : "Următoarea expansiune", 
			"tileNotPlanned" : "închis", 
			"infoLine" : "__runNumber__ așezare, Șansă de bonus x4: __chanceX4__%"  
        },

        "Technologies": {
            "Title": "Costul de cercetare pentru ",
            "Resource": "Resurse",
            "DescRequired": "Necesar",
            "DescInStock": "Disponibil",
			"DescStillMissing": "<span style='color:#29b206'>Surplus</span> / <span style='color:#ef1616'>Lipsă</span>",
			"NoTechs": "Ai finalizat toate cercetările din era curentă",
            "Eras": {
                1: "Epoca de Piatră",
                2: "Epoca Bronzului",
                3: "Epoca Fierului",
                4: "Evul Mediu Timpuriu",
                5: "Evul Mediu Mijlociu",
                6: "Evul Mediu Târziu",
                7: "Era Colonială",
                8: "Era Industrială",
                9: "Era Progresistă",
                10: "Epoca Modernă",
                11: "Epoca Postmodernă",
                12: "Era Contemporană",
                13: "Mâine",
                14: "Viitorul",
                15: "Viitorul Arctic",
                16: "Viitorul Oceanic",
                17: "Viitorul Virtual",
                18: "Marte în Era Spațială",
                19: "Ceres în Era Spațială"
            }
        },

        "Campagne": {
            "Title": "Costuri de cucerire pentru ",
            "Reward": "Total recompense",
            "AlreadyDone": " cucerită deja!",
            "Resource": "Resurse",
            "DescRequired": "Necesar",
            "DescInStock": "Disponibil",
            "DescStillMissing": "<span style='color:#29b206'>Surplus</span> / <span style='color:#ef1616'>Lipsă</span>",
        },

        "Negotiation": {
            "Title": "Ajutor pentru negocieri",
            "WrongGoods": "Bunuri alese greșit. Finalizează manual.",
            "TryEnd": "Încercări indisponibile",
            "Canceled": "Negocierea a fost anulată",
            "Success": "Succes",
            "Chance": "Șansă",
			"Person": "Persoană",
			"Average": "Ø Cantitate",
			"Costs": "Cost:",
			"Round": "Rundă",
			"Stock": "Stoc:",
			"GoodsLow": "ATENȚIE: Stocul de bunuri este la nivel scăzut!",
			"GoodsCritical": "ATENȚIE: Stocul de bunuri este la nivel critic!",
			"DragDrop": "Poți muta pictogramele bunurilor de mai sus, folosind drag & drop, pentru a stabili ordinea primei încercări.",
			"TableLoadError": "Eroare la încărcara mesei de negociere."
        },

		"Settings" : {
			"Title" : "Setări",
			"Active" : "Activ",
			"Inactive" : "Inactiv",
		},

		"Infobox" : {
			"Title" : "InfoBox",
			"Filter" : "Filtre",
			"FilterGex" : "EG",
			"FilterAuction" : "Licitație",
			"FilterLevel" : "Creștere CL",
			"FilterMessage" : "Centru de mesaje",
			"FilterTrade" : "Piața",
			"ResetBox" : "Resetare",
			"Messages" : {
				"GEX" : "<strong>__player__</strong> tocmai a primit __points__ puncte în EG.",
				"LevelUp" : "__player__ a ajuns la nivelul __level__ al clădirii __building__. <br>Ai ieșit pe locul <strong>__rank__th</strong>.",
				"Auction" : "'<strong>__player__</strong> a licitat __amount__ monede.",
				"Trade" : "<strong>__player__</strong> a acceptat oferta ta.<br>Ai primit __needValue__ __need__ pentru __offerValue__ __offer__",
				"MsgBuilding" : "__building__ - Nivelul __level__"
			}
		},

		"Units" : {
			"Title": "Prezentare generală a unităților militare",
			"NextUnitsIn": "Următoarele __count__ unități vor sosi în <span class=\"alca-countdown\"></span>, la ora __harvest__",
			"ReadyToLoot": "Pregătit să lupte!",
			"Proportionally": "Proporționalitate",
			"Quantity": "Cantitate",
			"Unit": "Unități",
			"Status": "Status",
			"Attack": "Atac",
			"Defend": "Apărare",
			"NotFilled": "nu este completat",
			"Bind": "Atașat",
			"Unbind": "Liber"
		},
		
		"CityMap": {
			"Title": "Transmite datele",
			"Desc1": "Pentru a putea planifica orașul, este nevoie să trimitem datele tale către foe-rechner.de",
			"Desc2": "<button class='btn-default' id='submit-data' onclick='CityMap.SubmitData()'>Trimite</button>",
			"SubmitSuccess": "Datale au fost transmise cu susces... Vizitează acum"
		}
	},

	"Menu" : {
		"Producția" : {
			"Title" : "Prezentarea generală a producției",
			"Desc" : "Afișează toate producțiile în curs."
		},
		"Calculator" : {
			"Title" : "Calculator contribuții externe",
			"Desc" : "Calculează toate locurile disponibile și punctele care pot fi obținute",
			"Warning": "Dezactivat: Deschide mai întâi o clădirea a unui jucător!"
		},
		"OwnpartCalculator" : {
			"Title" : "Calculator contribuție proprie",
			"Desc" : "Creează un plan de contribuție, calculează locurile disponibile și copiază valorile",
			"Warning": "Dezactivat: Deschide mai întâi o cladire legendară proprie!"
        },
        "Technologies": {
            "Title": "Technologii",
            "Desc": "Calculează costurile pentru cercetarea tehnologiilor noi",
            "Warning": "Dezactivat: Deschide mai întâi meniul de cercetare a tehnologiilor!"
        },
        "Campagne": {
            "Title": "Harta continent",
            "Desc": "Prezentarea generală a resurselor necesare",
        	"Warning" : "Dezactivat: Vizitează mai întâi o provincie!"
		},
        "Negotiation": {
            "Title": "Ajutor pentru negocieri",
			"Desc": "Face propuneri precise pentru negocieri",
			"Warning": "Dezactivat: Începe mai întâi o negociere!"
        },
		"Settings" : {
			"Title" : "Setări",
			"Desc" : "Setări ale aplicației"
		},
		"Chat" : {
			"Title" : "Mesagerie pentru ghildă",
			"Desc" : "Discută în timp real cu toată lumea"
		},
		"Unit" : {
			"Title" : "Unități militare",
			"Desc": "Prezentarea generală a unităților tale militare",
			"Warning": "Deschide 1x \"Gestionarea armatei\" <br>Tasta \"U\""
		},
		"Forum" : {
			"Title" : "Forum",
			"Desc" : "Ai o întrebare? Te deranjează ceva? Sau doar vrei să discutăm ..."
		},
		"Ask" : {
			"Title" : "Întrebare / Răspuns",
			"Desc" : "Nu știi cum funcționează ceva din cadrul aplicație?<br>Aruncă o privire aici!"
		},
		"Bugs" : {
			"Title" : "Greșeli / Propuneri",
			"Desc" : "Ceva nu este cum trebuie sau ai o idee?"
		},
		"OutP" : {
			"Title" : "Așezare culturală",
            "Desc": "Prezentarea generală a resurselor necesare",
            "DescWarningOutpostData": "<em id='outPW' class='tooltip-error'>Dezactivat: Începe mai întâi construcția unei așezări culturale și reîncarcă pagina (F5)",
			"DescWarningBuildings" : "<em id='outPW' class='tooltip-error'>Dezactivat: Deschide mai întâi Așezarea culturală!<br></em>Prezentarea generală a resurselor necesare"
		},
		"Info" : {
			"Title" : "InfoBox",
			"Desc" : "Îți arată toate lucrurile care se petrec în \"background\"<br><em>Completează informațiile ...</em>"
		}
	},

	"Settings" : {
		"Version": {
			"Title" : "Versiune",
			"DescDebug" : "Extensie pentru Chrome <strong class='text-danger'>BETA</strong> Version",
			"Desc" : "Versiunea extensiei pentru Chrome "
		},
		"GlobalSend": {
			"Title" : "Transmitere către foe-rechner.de",
			"Desc" : "Dacă dorești să urmărești datele cu ghilda ta, activează această opțiune. <br> Pentru utilizarea personală, dezactivează opțiunea."
		},
		"SendTavernInfo": {
			"Title" : "Activitatea de motivație",
			"Desc" : "Ar trebui să fie transferate activitățile de motivație la misiunile evenimentelor?"
		},
		"SendGEXInfo": {
			"Title" : "Evaluarea EG",
			"Desc" : "Datele sunt transmise când accesezi clasamentul EG"
		},
		"SendGildMemberLGInfo": {
			"Title" : "Datele clădirilor legendare ale membrilor ghildei",
			"Desc" : "Când vizitezi colegii de ghildă, toate datele CL vor fi trimise către foe-rechner.de, după ce se revine la Global." //TODO: to be check
		},
		"ShowNeighborsGoods": {
			"Title" : "Producția vecinilor",
			"Desc" : "În timpul vizitării orașului unui vecin, vezi care sunt producțiile finalizate ale acestuia"
		},
		"SendInvestigations": {
			"Title" : "PF investite",
			"Desc" : "Când accesezi 'Primărie'> 'News'> 'Legendary Buildings' datele despre PF investite vor fi transmise"
		},
		"ShowTavernBadge": {
			"Title" : "Show tavernas badge",  //TODO: to be translated
			"Desc" : "As soon as the extra move in the tavern is activated, a globally movable counter appears."
		}, //TODO: to be translated
		"PreScanLGList": {
			"Title" : "Citirea preliminară a datelor despre CL",
			"Desc" : "Citește datele despre toate clădirile legendare ale unui vecin și determină dacă există locuri disponibile. <br> <u> NOTĂ: </u> Deoarece datele exacte sunt transmise doar după deschiderea unei clădiri, rezultatul poate diferi. Citirea este însă salvată." //TODO: to be check
		},
		"AutomaticNegotiation": {
			"Title" : "Ajutor pentru negocieri",
			"Desc" : "Dorești ca asistentul de negociere să se deschidă automat cu o negociere și să fie închis la anulare?"
		},
		"ResetBoxPositions": {
			"Title" : "Coordonatele casetei",
			"Desc" : "Dorești resetarea tuturor coordonatelor casetei?",
			"Button" : "Șterge!"
		},
		"ChangeLanguage": {
			"Title" : "Schimbă limba",
			"Desc" : "Care limbă ar trebui folosită?",
			"Dropdown": {
				"de": "Germană",
				"en": "Engleză",
				"fr": "Franceză",
				"es": "Spaniolă",
				"ro": "Română",
				"ru": "Rusă"
			}
		}
	},

	"Eras": {
		"NoAge": "Nici o eră",
		"StoneAge": "Epoca de Piatră",
		"BronzeAge": "Epoca Bronzului",
		"IronAge": "Epoca Fierului",
		"EarlyMiddleAge": "Evul Mediu Timpuriu",
		"HighMiddleAge": "Evul Mediu Mijlociu",
		"LateMiddleAge": "Evul Mediu Târziu",
		"ColonialAge": "Era Colonială",
		"IndustrialAge": "Era Industrială",
		"ProgressiveEra": "Era Progresistă",
		"ModernEra": "Epoca Modernă",
		"PostModernEra": "Epoca Postmodernă",
		"ContemporaryEra": "Era Contemporană",
		"TomorrowEra": "Mâine",
		"FutureEra": "Viitorul",
		"ArcticFuture": "Viitorul Arctic",
		"OceanicFuture": "Viitorul Oceanic",
		"VirtualFuture": "Viitorul Virtual",
		"SpaceAgeMars": "Marte în Era Spațială"
	},
	
	"API" : {
		"UpdateSuccess" : "Actualizare efectuată",
		"GEXPlayer" : "Clasamentul EG a fost actualizat",
		"GEXChampionship" : "Contribuția membrilor ghildei la EG a fost actualizată",
		"LGInvest" : "Datele despre investițiile tale în CL au fost transmise",
		"LGGildMember" : "Datele despre clădirile legendare ale lui "__player__'s au fost transmise"
	}
};
