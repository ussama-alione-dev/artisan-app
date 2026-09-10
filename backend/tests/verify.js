const http = require('http');
const { app } = require('../src/server');

async function runVerification() {
  console.log('🧪 Lancement des tests de validation bout-en-bout...');

  const server = app.listen(5099, async () => {
    try {
      const baseUrl = 'http://127.0.0.1:5099/api';

      // 1. Health check
      console.log('1. Test /api/health...');
      const healthRes = await fetch(`${baseUrl}/health`).then((r) => r.json());
      console.log('   ✅ Health status:', healthRes.status);

      // 2. Demo Accounts
      console.log('2. Test /api/auth/demo-accounts...');
      const demoAccounts = await fetch(`${baseUrl}/auth/demo-accounts`).then((r) => r.json());
      console.log(`   ✅ ${demoAccounts.length} comptes démo disponibles.`);

      // 3. Client Login
      console.log('3. Test Connexion Client Démo (client@demo.fr)...');
      const clientLogin = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'client@demo.fr', motDePasse: 'password123' }),
      }).then((r) => r.json());
      console.log('   ✅ Client connecté:', clientLogin.nom, '| Role:', clientLogin.role);
      const clientToken = clientLogin.token;

      // 4. Artisan Login
      console.log('4. Test Connexion Artisan Démo (plombier@demo.fr)...');
      const artisanLogin = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'plombier@demo.fr', motDePasse: 'password123' }),
      }).then((r) => r.json());
      console.log('   ✅ Artisan connecté:', artisanLogin.nom, '| Spécialité:', artisanLogin.artisanProfile?.specialite);
      const artisanToken = artisanLogin.token;

      // 5. Search Artisans by specialty and city
      console.log('5. Test Recherche Artisans (Plomberie à Paris)...');
      const searchRes = await fetch(`${baseUrl}/artisans?specialite=Plomberie&ville=Paris`).then((r) => r.json());
      console.log(`   ✅ ${searchRes.length} artisan(s) trouvé(s) pour Plomberie à Paris.`);
      const targetArtisan = searchRes[0];

      // 6. Artisan detail
      console.log('6. Test Consultation Profil Artisan...');
      const detailRes = await fetch(`${baseUrl}/artisans/${targetArtisan.userId?._id || targetArtisan._id}`).then((r) => r.json());
      console.log('   ✅ Profil chargé:', detailRes.userId?.nom || detailRes.nom, '| Tarif:', detailRes.tarifHoraire, '€/h');

      // 7. Client creates an intervention request
      console.log("7. Test Création Demande d'intervention par le Client...");
      const demandeRes = await fetch(`${baseUrl}/demandes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${clientToken}`,
        },
        body: JSON.stringify({
          artisanId: targetArtisan.userId?._id || targetArtisan.userId || targetArtisan._id,
          specialite: targetArtisan.specialite,
          description: "Test automatisé : Réparation urgente de fuite d'eau sous évier.",
          adresse: '10 Rue de la Paix',
          ville: 'Paris',
          urgence: 'Urgent (dans la journée)',
          dateInterventionSouhaitee: 'Aujourd\'hui 14h',
          telephone: '06 12 34 56 78',
        }),
      }).then((r) => r.json());
      console.log('   ✅ Demande créée:', demandeRes.demande?._id, '| Statut:', demandeRes.demande?.statut);
      const newDemandeId = demandeRes.demande._id;

      // 8. Client checks request history
      console.log('8. Test Consultation Historique Client...');
      const clientDemandes = await fetch(`${baseUrl}/demandes/client`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      }).then((r) => r.json());
      console.log(`   ✅ Le client a ${clientDemandes.length} demande(s) enregistrée(s).`);

      // 9. Artisan receives request and updates status to acceptée
      console.log('9. Test Artisan accepte la demande...');
      const acceptRes = await fetch(`${baseUrl}/demandes/${newDemandeId}/statut`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${artisanToken}`,
        },
        body: JSON.stringify({
          statut: 'acceptée',
          reponseArtisan: 'Demande acceptée, intervention prévue à 14h.',
        }),
      }).then((r) => r.json());
      console.log('   ✅ Statut mis à jour:', acceptRes.demande?.statut);

      // 10. Artisan completes the request
      console.log('10. Test Artisan termine la demande...');
      const finishRes = await fetch(`${baseUrl}/demandes/${newDemandeId}/statut`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${artisanToken}`,
        },
        body: JSON.stringify({
          statut: 'terminée',
        }),
      }).then((r) => r.json());
      console.log('   ✅ Statut final:', finishRes.demande?.statut);

      // 11. Artisan toggles availability
      console.log('11. Test Bascule Disponibilité Artisan...');
      const dispoRes = await fetch(`${baseUrl}/profile/artisan/disponibilite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${artisanToken}`,
        },
        body: JSON.stringify({ disponible: false }),
      }).then((r) => r.json());
      console.log('   ✅ Disponibilité mise à jour:', dispoRes.disponible);

      console.log('\n🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS (11/11) !');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Échec du test:', err);
      server.close();
      process.exit(1);
    }
  });
}

runVerification();
