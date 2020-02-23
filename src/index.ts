#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const axios = require('axios').default;
const debug = false;
var targetLanguage = xenv('DEFAULT_LANGUAGE', 'en');

program
	.version('0.0.1')
	.description('A CLI to translate easily')
	.option('-t, --target <language>', 'Language to translate to in abbreviation [en]')
	.parse(process.argv);

const getTranslation = async (words: string) => {
	if (program.target) targetLanguage = program.target;

	const key = xenv('KEY', '');
	if (key == '') return [];

	xprint(`translating "${words}" to ${targetLanguage}`);

	let result: string[] = [];
	try {
		let response = await axios.post(
			`https://translation.googleapis.com/language/translate/v2?q=${words}&target=${targetLanguage}&key=${key}`
		);
		xprint(response.data.data.translations);
		for (var t of response.data.data.translations) {
			result.push(t.translatedText);
		}
	} catch (error) {
		console.error(error);
		console.error(error.response.status);
	}
	xprint('returning', result);
	return result;
};

function xenv(value: string, fallback: string): string {
	const v = process.env[value];
	if (v == undefined) {
		return fallback;
	}

	return v;
}

function xprint(msg?: any, ...msgs: any[]): void {
	if (debug) {
		console.log(msg, msgs.join(' '));
	}
}

const printTranslations = async () => {
	const words = process.argv.slice(2).join(' ');
	const translations = await getTranslation(words);
	if (translations) {
		for (let t of translations) {
			console.log(t);
		}
	}
};

printTranslations();
