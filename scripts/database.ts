import mongoose from 'mongoose';

// Async function that returns an initialized mongo client using mongoose
export default async function initializeClient() {
    // Initialize and connect the client
    const uri = "mongodb://127.0.0.1:27017";
    return await mongoose.connect(uri)
}