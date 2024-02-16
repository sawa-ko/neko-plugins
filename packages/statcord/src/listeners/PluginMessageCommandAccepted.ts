import { Events, Listener, type MessageCommandAcceptedPayload } from '@sapphire/framework';

export class PluginListener extends Listener<typeof Events.MessageCommandAccepted> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, { ...options, name: 'PluginStatcordMessageCommandAccepted', event: Events.MessageCommandAccepted });
	}

	public run({ command, message }: MessageCommandAcceptedPayload) {
		if (this.container.client.options.statcord?.debug) {
			this.container.logger.debug(`[Statcord-Plugin]: Logging use of the ${command.name} message command`);
		}

		this.container.statcord.postCommand(command.name, message.author.id);
	}
}
