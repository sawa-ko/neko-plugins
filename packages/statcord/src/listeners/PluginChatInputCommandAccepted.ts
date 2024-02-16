import { Events, Listener, type ChatInputCommandAcceptedPayload } from '@sapphire/framework';

export class PluginListener extends Listener<typeof Events.ChatInputCommandAccepted> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, { ...options, name: 'PluginStatcordChatInputCommandAccepted', event: Events.ChatInputCommandAccepted });
	}

	public run({ command, interaction }: ChatInputCommandAcceptedPayload) {
		if (this.container.client.options.statcord?.debug) {
			this.container.logger.debug(`[Statcord-Plugin]: Logging use of the ${command.name} interaction command`);
		}

		this.container.statcord.postCommand(command.name, interaction.user.id);
	}
}
