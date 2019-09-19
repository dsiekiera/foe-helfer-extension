/*
 * **************************************************************************************
 *
 * Dateiname:                 inject.js
 * Projekt:                   foe
 *
 * erstellt von:              Daniel Siekiera <daniel.siekiera@gmail.com>
 * zu letzt bearbeitet:       16.09.19, 14:37 Uhr
 *
 * Copyright © 2019
 *
 * **************************************************************************************
 */


let tid = setInterval(InjectCode, 5),
	manifestData = chrome.runtime.getManifest(),
	PossibleLangs = ['de','en','fr'],
	v = manifestData.version;

// muss sehr früh in den head-Tag
function InjectCode()
{
	if(document.head !== null){

		let script = document.createElement('script');

		script.innerText = "let extID='"+ chrome.runtime.id + "',devMode=" + !('update_url' in chrome.runtime.getManifest()) + ";";
		document.head.appendChild(script);

		// Stylesheet einfügen
		let style = document.createElement('link');
		style.href = chrome.extension.getURL('css/web/style-menu.css?v=' + v);
		style.rel = 'stylesheet';
		document.head.appendChild(style);


		// Stylesheet einfügen
		let boxes = document.createElement('link');
		boxes.href = chrome.extension.getURL('css/web/boxes.css?v=' + v);
		boxes.rel = 'stylesheet';
		document.head.appendChild(boxes);

		clearInterval(tid);
	}
}


// Translation
let lang = window.navigator.language.split('-')[0];

// gibt es eine Übersetzung?
if(PossibleLangs.includes(lang) === false)
{
	lang = 'de';
}

let i18nJS = document.createElement('script');
i18nJS.src = chrome.extension.getURL('js/web/i18n/' + lang + '.js?v=' + v);
i18nJS.id = 'i18n-script';
i18nJS.onload = function(){
	this.remove();
};
(document.head || document.documentElement).appendChild(i18nJS);


setTimeout(()=>{

	let vendorScripts = [
		'moment/moment-with-locales.min',
		'CountUp/jquery.easy_number_animate.min',
		'clipboard/clipboard.min',
		'Tabslet/jquery.tabslet.min',
		'ScrollTo/jquery.scrollTo.min',
		'jQuery/jquery-resizable.min',
		'tooltip/tooltip',
		'tableSorter/table-sorter',
	];

	for(let vs in vendorScripts)
	{
		if(vendorScripts.hasOwnProperty(vs))
		{
			let sc = document.createElement('script');
			sc.src = chrome.extension.getURL('vendor/' + vendorScripts[vs] + '.js?v=' + v);
			sc.onload = function(){
				this.remove();
			};
			(document.head || document.documentElement).appendChild(sc);
		}
	}


	let s = [
		'helper',
		'ant',
		'menu',
		'tavern',
		'outposts',
		'calculator',
		'infoboard',
		'productions',
		'part-calc',
		'read-buildings',
		'settings',
		'strategy-points',
		'citymap'
	];

	// Scripte laden
	for(let i in s){
		if(s.hasOwnProperty(i)){
			let sc = document.createElement('script');
			sc.src = chrome.extension.getURL('js/web/' + s[i] + '.js?v=' + v);
			sc.onload = function(){
				this.remove();
			};
			(document.head || document.documentElement).appendChild(sc);
		}
	}
}, 500);
