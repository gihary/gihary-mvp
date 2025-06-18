const { getFirestore } = require('./firestore');

/**
 * Save data to the core memory collection.
 *
 * Data is stored under `core_memory/{id}/info`. The `id` comes from
 * `data.email` if present, otherwise any available identifier in `data.id`.
 * Existing documents are updated with merge=true to retain previous fields.
 *
 * @param {object} data - Data to persist.
 * @returns {Promise<object>} The stored payload.
 */
async function saveToCore(data) {
  if (!data) throw new Error('data is required');
  const id = data.email || data.id;
  if (!id) throw new Error('identifier required');

  const db = getFirestore();
  const docRef = db
    .collection('core_memory')
    .doc(id)
    .collection('info')
    .doc('info');

  const payload = {
    nome: data.nome,
    ultimi_intenti: data.ultimi_intenti,
    parole_chiave: data.parole_chiave,
    priorità_media: data.priorità_media,
    ultimo_aggiornamento: data.ultimo_aggiornamento || Date.now(),
  };

  const snap = await docRef.get();
  if (snap.exists) {
    await docRef.set(payload, { merge: true });
  } else {
    await docRef.set(payload);
  }
  return payload;
}

module.exports = { saveToCore };
