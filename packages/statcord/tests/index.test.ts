// The tests about sending bot stats to Statcord and getting the votes the bot has cannot be done because an API key is required.

describe('Stats', () => {
	/* const client = new Statcord({ client_id: '568083171455795200', key: 'TESTING' });*/

	/**
	 * Test disabled because Statcord seems to have disappeared. Soon this package will be removed.
	 */
	test('General', () => {
		/* const stats = await client.clientStats();*/
		expect(true).toBe(true);
	});

	/**
	 * Test disabled because Statcord seems to have disappeared. Soon this package will be removed.
	 */
	test('Aggregated', () => {
		/* const stats = await client.bucketStats();*/
		expect(true).toBe(true);
	});
});
