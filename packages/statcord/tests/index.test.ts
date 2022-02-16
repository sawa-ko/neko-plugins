import { Statcord } from '../src';

// The tests about sending bot stats to Statcord and getting the votes the bot has cannot be done because an API key is required.
describe('Stats', () => {
	const client = new Statcord({ client_id: '568083171455795200', key: 'TESTING' });

	test('General', async () => {
		const stats = await client.clientStats();
		expect(stats).toMatchObject<{ error: boolean }>({ error: false });
	});

	test('Aggregated', async () => {
		const stats = await client.bucketStats();
		expect(stats).toMatchObject<{ error: boolean }>({ error: false });
	});
});
