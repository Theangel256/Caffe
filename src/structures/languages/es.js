module.exports = {
	no_reason: 'Incumplimiento de las reglas!',
	no_user: '**:grey_exclamation:** | Menciona a alguien',
	wait: '**:grey_exclamation: |** Tienes que esperar **{duration}** para poder volver a usar este comando',
	only_developers: '**:grey_exclamation: |** Sólo los desarolladores pueden usar esto :(',
	missingPerms: '{missingPerms0} y {missingPerms1}',
	userPerms: 'Debe tener los siguientes permisos: {function}',
	clientPerms: 'Me faltan los siguientes permisos: {function}',
	commands: {
		eightBall: {
			ball: ['Sí', 'No', 'Tal vez', 'No sé', '¡Claro!', 'Por supuesto', 'Por supuesto que no', 'Claro que no', 'Definitivamente', 'Tu que crees?', 'Hmmmm', 'Preguntaselo a tu mama'],
			title: '🎱Pregunta 8Ball',
			field1: 'Pregunta',
			field2: 'Respuesta',
			no_args: '**:grey_exclamation: |** Debes escribir una pregunta.',
		},
		angry: {
			no_user: '{user.username} Está Enojado 😡',
			user: '{author.username} Está Enojado con {user.username} 😡',
		},
		avatar: {
			no_user: 'Tu Avatar, {user.username}',
			user: 'Avatar de {user.username}',
		},
		balance: {
			no_user: ':moneybag: Tienes: **{money}**',
			user: ':moneybag: {user.username} Tiene: **{money}**',
		},
		ban: {
			no_args: '**:grey_exclamation:** | Proporcione una persona para banear.',
			no_user: '**:grey_exclamation:** | No se pudo encontrar ese miembro, intente nuevamente.',
			yourself: '**:grey_exclamation:** | No puedes banearte a ti mismo ..',
			bannable: '**:grey_exclamation:** | No puedo banear al usuario mencionado.',
			sucess: '{user.tag} fue baneado del servidor, razón: {reason}.',
		},
		clear: {
			no_args: '**:grey_exclamation: |** Ingrese el número de mensajes para eliminar',
			messages: {
				max: '**:exclamation: |** Solo puedo borrar mensajes con menos de 2 semanas de antigüedad',
				unknown: '**:exclamation: |** No hay mensajes para borrar',
			},
		},
		cry: {
			no_user: '{user.username} Esta triste 😢',
			user: '{author.username} Esta triste con {user.username} 😢',
		},
		daily: {
			sucess: 'Recompensa diaria reclamada **{total}**',
		},
		divorce: {
			nothing: '**:grey_exclamation: |** No estás casado con nadie :(',
			sucess: 'Te has divorciado de {esposa.tag}',
		},
		dm: {
			description: '**Descripcion**: Comando: escribirle un mensaje privado a un usuario\n[] Requerido',
			field: {
				title: '**Uso**',
				description: 'dm [@usuario] [texto]',
			},
			field2: {
				title: '**Ejemplo**',
				description: 'dm <@614957978675838976> Hola:grinning:',
			},
			field3: {
				title: 'Contenido',
				footer: 'Enviado Desde: {guild.name}',
			},
			sucess: '**MD enviado correctamente**',
		},
		gamble: {
			no_quantity: 'Especifique un número mayor o igual a los créditos que tiene o `todos` para apostar todos sus créditos.',
			insufficient_money: 'No tienes dinero suficiente, ocupas: $**50**',
			success: 'Felicitaciones, conservó sus créditos y ganó: {all} extra!',
			unsuccess: 'Perdiste {all} créditos :(',
			no_number: 'Debe ingresar un número',
			minimum: 'lo mínimo para poder apostar es $**50**',
			bit: 'No puedes apostar tan poco, ocupas: $**50**',
		},
		hug: {
			himself: '{user.username} se abrazó a sí mismo',
			another_person: '{author.username} Abrazó a {user.username}',
		},
		inventory: {
			oro: 'No tienes ningun objeto en el inventario, ve a minar o explorar.',
			inv: 'Inventario de {user.username}',
		},
		kick: {
			no_args: '**:grey_exclamation: |** Proporcione una persona para expulsar.',
			no_user: '**:grey_exclamation: |** No se pudo encontrar ese miembro, intente nuevamente.',
			yourself: '**:grey_exclamation: |** No puedes expulsarte ..',
			kickable: '**:grey_exclamation: |** No puedo expulsar al usuario mencionado.',
			sucess: '{user.tag} Fue expulsado del servidor, razón: {reason}.',
		},
		kill: {
			himself: '{user.username} Se mató a sí mismo',
			another_person: '{author.username} Mató a {user.username}',
		},
		kiss: {
			yourself: '**:grey_exclamation:** | No puedes besarte, es imposible ..',
			sucess: '**{author.username}** beso a {user.username}',
		},
		love: {
			bot: 'Un bot no tiene sentimientos.',
			relations: 'RELACIONES',
		},
		marry: {
			married: 'Ya estas casado con {esposaTag}',
			bot: 'No puedes casarte con un bot ..',
			yourself: 'No puedes casarte contigo mismo ..',
			another_married: 'Ese usuario ya está casado/a.',
			request: ':mega:**{user.username}**, escribe **yes** o **no** para responder a la proposición de matrimonio de **{author.username}**\n:stopwatch: Esto expira en 2 minutos.',
			sucess: 'Felicidades! {author.username} se caso con {user.username}!',
			unsucess: 'Uhh, {user.username} te rechazo cruel mente {author.username}!',
			expired: '**{user.username}** no respondio, la espera termino',
		},
		move: {
			disconnected: '**:grey_exclamation: |** No estoy dentro de un canal de voz',
			already_connected: '**:grey_exclamation: |** Ya estoy conectado a este canal de voz',
			sucess: '**:grey_exclamation: |** Me he movido a',
		},
		mute: {
			no_user: `Necesitas mencionar al usuario que quieres mutear, tambien necesitas establecer el tiempo:
\`\`\`prolog
S => Para milisegundos.
s => Para segundos.
m => Para minutos.
H o h => Para horas.
D o d => Para dias.
W o w => Para semanas.
M => Para meses.
\`\`\``,
			no_time: `Necesitas establecer el tiempo:
\`\`\`prolog
S => Para milisegundos.
s => Para segundos.
m => Para minutos.
H o h => Para horas.
D o d => Para dias.
W o w => Para semanas.
M => Para meses.
\`\`\``,
			invalid_format: 'Formato invalido, asegurate de poner el tiempo correctamente.',
			already_muted: 'Este usuario actualmente ya se encuentra silenciado.',
			highest: 'Este rol es más alto (en lo que respecta a una jerarquía), por lo que no puedo agregarlo a este usuario',
			sucess: '{user.tag} Ha sido silenciado Por: {by} razón: {reason}',
			himself: 'No te puedes silenciar/No me puedes silenciar.',
			muteembed: {
				description: 'Mute ejecutado por',
				user: 'Usuario Silenciado',
				in: 'Silenciado en',
				date: 'Fecha',
				by: 'Por',
				reason: 'Razón',
			},
		},
		pause: {
			alreadyPaused: 'La musica ya esta pausada',
			sucess: 'Canción actual en pausa.',
		},
		play: {
			no_args: '🚫 Debes ingresar algo a buscar',
			embed: {
				title: 'Selección de canciones. Escribe el número que precede al número de la canción',
				footer: 'Esta operación expira en 60 Segundos. {author.username}',
				nowPlaying: 'Reproduciendo ahora',
				time: 'Duración',
				channel: 'Canal',
			},
			expired: 'La espera termino, cancelando selección.',
			invalidArgs: 'No se ha encontrado ninguna canción con ese Nombre.',
			addQueue: 'Se ha agregado a la cola',
			error: 'Ha ocurrido un error porfavor contacta con un desarrollador, caffe-bot.glitch.me',
			playlistAdded: 'Playlist: **{title}** a sido añadida ala cola!',
		},
		punch: {
			no_user: '**{user.username}** se golpeo a el mismo...',
			user: '**{author.username}** golpeo a {user.username}',
		},
		queue: {
			embed: {
				title: 'Lista de canciones de {guild.name}',
				description: '{i}.[{title}]({url})\n👤 Por: **{author.username}**',
			},
			max: 'La pagina {seleccion} no existe',
			page: 'Página {seleccion} de {page}',
		},
		stats: {
			statistics: 'Estadísticas',
			owner: 'Dueño',
			guilds: 'Servidores',
			users: 'Usuarios',
			channels: 'Canales',
			commands: 'Comandos',
			events: 'Eventos',
			uptime: 'Actividad',
			connections: 'Conexiones a voz',
			version: 'Versión',
			usage: 'Uso de memoria',
		},
	},
	events: {
		message: {
			isMentioned: {
				field1: '> Para obtener la lista de comandos.',
				field2: 'Soporte',
				footer: 'Creado Por Theangel256 Studios V',
				invite: 'Invitación',
			},
			ant: {
				warn: 'invitación publicada',
				author: 'Usuario',
				reason: '**Razón:**',
				warns: 'Cantidad de Advertencias',
				moderator: 'Moderador responsable',
				warned: '{author.tag} Ha sido advertido',
			},
			cooldown: '**:grey_exclamation: |** Tienes que esperar `1.5s` para poder volver a usar este comando',
		},
	},
	language: {
		sucess: '**:grey_exclamation: |** Idioma establecido a Español',
		enterokay: '**:grey_exclamation: |** Debes ingresar un idioma, `es`: Español ó `en`: Inglés.',
		has: '**:grey_exclamation: |** Debe ser `es` ó `en`.',
	},
	permissions: {
		member: {
			BAN_MEMBERS: '**:grey_exclamation: |** No tienes permisos. `Banear Miembros`',
			MANAGE_MESSAGES: '**:grey_exclamation: |** No tienes permisos. `Gestionar Mensajes`',
			KICK_MEMBERS: '**:grey_exclamation: |** No tienes permisos. `Expulsar Miembros`',
		},
		me: {
			MANAGE_ROLES_and_MANAGE_CHANNELS: 'No tengo permisos. `Gestionar Roles`  Y `Gestionar Canales`',
			BAN_MEMBERS: '**:grey_exclamation: |** Perdon, pero no tengo permisos. `Banear Miembros`',
			MANAGE_MESSAGES: '**:grey_exclamation: |** Perdon, pero no tengo permisos. `Gestionar Mensajes`',
			KICK_MEMBERS: '**:grey_exclamation: |** Perdon, pero no tengo permisos. `Expulsar Miembros`',
		},
	},
	music: {
		noQueue: '¡No hay canción!, la cola esta vacía.',
		needJoin: 'Debes unirte a un canal de voz.',
	},
};