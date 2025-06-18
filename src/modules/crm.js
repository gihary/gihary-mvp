const { getFirestore } = require('../firestore');

function customersCollection() {
  return getFirestore().collection('customers');
}

async function createCustomer(data) {
  const docRef = await customersCollection().add(data);
  return { id: docRef.id, ...data };
}

async function getCustomer(id) {
  const doc = await customersCollection().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function findCustomerByEmail(email) {
  const snapshot = await customersCollection().where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function updateCustomer(id, data) {
  await customersCollection().doc(id).update(data);
}

async function deleteCustomer(id) {
  await customersCollection().doc(id).delete();
}

module.exports = {
  createCustomer,
  getCustomer,
  findCustomerByEmail,
  updateCustomer,
  deleteCustomer,
};
