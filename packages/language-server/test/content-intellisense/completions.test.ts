import path from 'node:path';
import { Position } from '@volar/language-server';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { type LanguageServer, getLanguageServer } from '../server.js';

describe('Content Intellisense - Completions', async () => {
	let languageServer: LanguageServer;

	before(async () => (languageServer = await getLanguageServer()));

	it('Provide completions for collection properties', async () => {
		const document = await languageServer.handle.openTextDocument(
			path.resolve(__dirname, '..', 'fixture', 'src', 'content', 'blog', 'completions.md'),
			'markdown',
		);

		const completions = await languageServer.handle.sendCompletionRequest(
			document.uri,
			Position.create(1, 1),
		);

		// We don't do any mapping ourselves here, so we'll just check if the labels are correct.
		const labels = (completions?.items ?? []).map((item) => item.label);
		expect(labels).to.include.members(['title', 'description', 'tags', 'type']);
	});

	it('Provide completions for collection property values', async () => {
		const document = await languageServer.handle.openTextDocument(
			path.resolve(__dirname, '..', 'fixture', 'src', 'content', 'blog', 'completions-values.md'),
			'markdown',
		);

		const completions = await languageServer.handle.sendCompletionRequest(
			document.uri,
			Position.create(1, 6),
		);

		const labels = (completions?.items ?? []).map((item) => item.label);
		expect(labels).to.include.members(['blog']);
	});
});
