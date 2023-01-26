import mongoose from 'mongoose';
import { ExampleType } from '../types/mongoose.types';

const ExampleSchema = new mongoose.Schema<ExampleType>({
	field: {
		dateField: {
			type: String,
			required: true,
			default: () => new Date(),
			immutable: false,
		},
	},
	arrayOfObjects: [
		{
			field: String,
		},
	],
});

export default mongoose.model<ExampleType>('Schema', ExampleSchema);