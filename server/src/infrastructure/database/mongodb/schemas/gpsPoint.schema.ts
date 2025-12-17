import mongoose, { Schema } from "mongoose";

export interface GpsPointAttr {
  trip: mongoose.Types.ObjectId;
  idx: number;
  latitude: number;
  longitude: number;
  recordedAt: Date;
  speedKmph: number;
  ignitionOn: boolean;
  isIdle: boolean;
  isStop: boolean;
  isOverSpeed: boolean;
}

export interface GpsPointDoc extends mongoose.Document, GpsPointAttr {
  createdAt: Date;
  updatedAt: Date;
}

interface GpsPointModel extends mongoose.Model<GpsPointDoc> {
  build(attrs: GpsPointAttr): GpsPointDoc;
}

const gpsPointSchema = new Schema<GpsPointDoc, GpsPointModel>(
  {
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    idx: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    recordedAt: { type: Date, required: true },
    speedKmph: { type: Number, required: true },
    ignitionOn: { type: Boolean, required: true },
    isIdle: { type: Boolean, required: true },
    isStop: { type: Boolean, required: true },
    isOverSpeed: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

gpsPointSchema.index({ trip: 1, idx: 1 }, { unique: true });
gpsPointSchema.index({ trip: 1, recordedAt: 1 });

gpsPointSchema.statics.build = (attrs: GpsPointAttr) => new GpsPoint(attrs);

const GpsPoint = mongoose.model<GpsPointDoc, GpsPointModel>(
  "GpsPoint",
  gpsPointSchema
);

export { GpsPoint };

