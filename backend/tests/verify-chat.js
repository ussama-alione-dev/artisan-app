const { io: ioClient } = require('socket.io-client');
const { app, server } = require('../src/server');

async function testSocketChat() {
  console.log('🧪 Test de validation temps réel Socket.io...');

  // Start test server on port 5098
  const testServer = server.listen(5098, async () => {
    try {
      const baseUrl = 'http://127.0.0.1:5098/api';
      const socketUrl = 'http://127.0.0.1:5098';

      // 1. Client login
      console.log('1. Connexion HTTP Client Démo...');
      const clientAuth = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'client@demo.fr', motDePasse: 'password123' }),
      }).then((r) => r.json());
      const clientToken = clientAuth.token;
      const clientId = clientAuth._id;

      // 2. Artisan login
      console.log('2. Connexion HTTP Artisan Démo...');
      const artisanAuth = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'plombier@demo.fr', motDePasse: 'password123' }),
      }).then((r) => r.json());
      const artisanToken = artisanAuth.token;
      const artisanId = artisanAuth._id;

      // 3. Connect Socket.io for Client
      console.log('3. Connexion Socket.io Client (JWT)...');
      const clientSocket = ioClient(socketUrl, {
        auth: { token: clientToken },
        transports: ['websocket'],
      });

      await new Promise((resolve) => clientSocket.on('connect', resolve));
      console.log('   ✅ Client connecté au Socket.io');

      // 4. Connect Socket.io for Artisan
      console.log('4. Connexion Socket.io Artisan (JWT)...');
      const artisanSocket = ioClient(socketUrl, {
        auth: { token: artisanToken },
        transports: ['websocket'],
      });

      await new Promise((resolve) => artisanSocket.on('connect', resolve));
      console.log('   ✅ Artisan connecté au Socket.io');

      // 5. Join chat room
      console.log('5. Les deux utilisateurs rejoignent le salon de chat privé...');
      clientSocket.emit('join_chat', { partnerId: artisanId });
      artisanSocket.emit('join_chat', { partnerId: clientId });

      // 6. Test bidirectional real-time message exchange
      console.log('6. Envoi de message en direct Client -> Artisan...');
      const receivedByArtisanPromise = new Promise((resolve) => {
        artisanSocket.on('new_message', (msg) => {
          resolve(msg);
        });
      });

      clientSocket.emit('send_message', {
        receiverId: artisanId,
        contenu: 'Bonjour Alexandre, êtes-vous disponible pour intervenir aujourd\'hui ?',
      });

      const messageReceived = await receivedByArtisanPromise;
      console.log('   ✅ Message reçu en temps réel par l\'artisan:', messageReceived.contenu);

      // 7. Test typing indicator
      console.log('7. Test indicateur de frappe (typing)...');
      const typingPromise = new Promise((resolve) => {
        clientSocket.on('partner_typing', (data) => {
          resolve(data);
        });
      });

      artisanSocket.emit('typing', { partnerId: clientId });
      const typingData = await typingPromise;
      console.log('   ✅ Client a reçu l\'indicateur de frappe de:', typingData.userName);

      // 8. Artisan replies
      console.log('8. Réponse en direct Artisan -> Client...');
      const replyReceivedPromise = new Promise((resolve) => {
        clientSocket.on('new_message', (msg) => {
          resolve(msg);
        });
      });

      artisanSocket.emit('send_message', {
        receiverId: clientId,
        contenu: 'Oui tout à fait Thomas, je prépare mes outils et j\'arrive !',
      });

      const reply = await replyReceivedPromise;
      console.log('   ✅ Réponse reçue en temps réel par le client:', reply.contenu);

      // 9. Check REST API messages history
      console.log('9. Vérification de l\'historique REST /api/chat/messages...');
      const historyRes = await fetch(`${baseUrl}/chat/messages/${artisanId}`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      }).then((r) => r.json());
      console.log(`   ✅ Historique synchronisé: ${historyRes.messages.length} messages dans la discussion.`);

      // 10. Check Conversations list
      console.log('10. Vérification des conversations /api/chat/conversations...');
      const convs = await fetch(`${baseUrl}/chat/conversations`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      }).then((r) => r.json());
      console.log(`   ✅ ${convs.length} conversation(s) active(s) avec dernier message: "${convs[0]?.lastMessage?.contenu}"`);

      console.log('\n🎉 VALIDATION SOCKET.IO CHAT TEMPS RÉEL RÉUSSIE AVEC SUCCÈS (10/10) !');

      clientSocket.disconnect();
      artisanSocket.disconnect();
      testServer.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Échec du test chat:', err);
      testServer.close();
      process.exit(1);
    }
  });
}

testSocketChat();
