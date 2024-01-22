import { type MessageCommandAcceptedPayload, type ChatInputCommandAcceptedPayload, Events, Listener } from '@sapphire/framework';

export class MessagePluginListener extends Listener<typeof Events.MessageCommandAccepted> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, { ...options, event: Events.MessageCommandAccepted, name: 'StatcordPostMessageCommand' });
	}

	public run({ command, message }: MessageCommandAcceptedPayload) {
		if (this.container.client.options.statcord?.debug) {
			this.container.logger.debug(`[Statcord-Plugin]: Logging use of the ${command.name} message command`);
		}

		this.container.statcord.postCommand(command.name, message.author.id);
	}
}

export class InteractionPluginListener extends Listener<typeof Events.ChatInputCommandAccepted> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, { ...options, event: Events.ChatInputCommandAccepted, name: 'StatcordPostInteractionCommand' });
	}

	public run({ command, interaction }: ChatInputCommandAcceptedPayload) {
		if (this.container.client.options.statcord?.debug) {
			this.container.logger.debug(`[Statcord-Plugin]: Logging use of the ${command.name} interaction command`);
		}

		this.container.statcord.postCommand(command.name, interaction.user.id);
	}
}
