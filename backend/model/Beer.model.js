import mongoose from "mongoose";

export const BeerSchema = new mongoose.Schema({
    beerOwner: {
        type: String,
        required: [true, "No Beer Owner Found"],
        unique: false
    },
    beerName: {
        type: String,
        required: [true, "Please enter a Beer Name"],
        unique: false
    },
    beerVariant: {
        type: String,
        required: [true, "Please enter a Beer Variant"],
        unique: false
    },
    beerDescription: {
        type: String,
        required: [true, "Please enter a Beer Description"],
        unique: false
    },
    beerRating: {
        type: String,
        required: [true, "Please enter a Beer Rating"],
        unique: false
    },
    beerPhoto: {
        type: String,
        unique: false
    },
    beerDate: {
        type: String,
        unique: false
    },
    beerVerticalStyle: {
        type: String,
        unique: false
    },
    beerHorizontalStyle: {
        type: String,
        unique: false
    },
    beerWidthStyle: {
        type: String,
        unique: false
    }
});

export default mongoose.model.Beers || mongoose.model('Beer', BeerSchema);