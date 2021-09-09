import mongoose from 'mongoose';

// Async function that returns an initialized mongo client using mongoose
export default async function initializeClient(): Promise<typeof mongoose> {
    // Initialize and connect the client
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const uri: string = process.env.DB_URI!;
    return await mongoose.connect(uri)
}