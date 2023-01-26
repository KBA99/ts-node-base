import mongoose from 'mongoose';

export interface ExampleType extends mongoose.Document {
	field: {
		dateField: {
			dateField: String
		}
	}
	arrayOfObjects: Object[]
}