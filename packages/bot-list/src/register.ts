import { container, Plugin, postLogin, preGenericsInitialization, SapphireClient } from '@sapphire/framework';
import { BotList } from '.';

export class BotListPlugin extends Plugin {
	public static [preGenericsInitialization](this: SapphireClient) {
		container.botList = new BotList(this.options.botList ?? { keys: {} });
	}

	public static [postLogin](this: SapphireClient) {
		if (this.options.botList?.autoPost?.enabled ?? true) {
			container.logger.info('[BotList-Plugin]: Auto-posting has been enabled.');

			setInterval(() => container.botList.postStats(), this.options.botList?.autoPost?.interval ?? 3.6e6);
		}
	}
}

SapphireClient.plugins.registerPreGenericsInitializationHook(BotListPlugin[preGenericsInitialization], 'BotList-PreGenericsInitialization');
SapphireClient.plugins.registerPostLoginHook(BotListPlugin[postLogin], 'BotList-PostLogin');

declare module '@sapphire/pieces' {
	interface Container {
		botList: BotList;
	}
}
