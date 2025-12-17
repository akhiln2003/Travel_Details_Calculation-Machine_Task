import mongoose, { Schema } from "mongoose";

export interface TripStats {
  totalDistanceMeters: number;
  durationMs: number;
  idleDurationMs: number;
  stoppageDurationMs: number;
  overspeedDurationMs: number;
  overspeedSegments: number;
  averageSpeedKmph: number;
  maxSpeedKmph: number;
}

export interface TripAttr {
  user: mongoose.Types.ObjectId;
  name: string;
  sourceFileName: string;
  startedAt: Date;
  endedAt: Date;
  stats: TripStats;
}

export interface TripDoc extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  name: string;
  sourceFileName: string;
  startedAt: Date;
  endedAt: Date;
  stats: TripStats;
  createdAt: Date;
  updatedAt: Date;
}

interface TripModel extends mongoose.Model<TripDoc> {
  build(attrs: TripAttr): TripDoc;
}

const tripSchema = new Schema<TripDoc, TripModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    name: { type: String, required: true },
    sourceFileName: { type: String, required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    stats: {
      totalDistanceMeters: { type: Number, required: true },
      durationMs: { type: Number, required: true },
      idleDurationMs: { type: Number, required: true },
      stoppageDurationMs: { type: Number, required: true },
      overspeedDurationMs: { type: Number, required: true },
      overspeedSegments: { type: Number, required: true },
      averageSpeedKmph: { type: Number, required: true },
      maxSpeedKmph: { type: Number, required: true },
    },
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

tripSchema.index({ user: 1, createdAt: -1 });

tripSchema.statics.build = (attrs: TripAttr) => new Trip(attrs);

const Trip = mongoose.model<TripDoc, TripModel>("Trip", tripSchema);

export { Trip };

