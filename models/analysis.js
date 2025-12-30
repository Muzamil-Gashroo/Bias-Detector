import mongoose from 'mongoose'

const analysisSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['text', 'url'],
      required: true
    },

    input: {
      type: String,
      required: true
    },

    
    raw_output: {
      type: String,
      required: true
    },

    result: {
      bias_level: {
        type: String
      },
      confidence: {
        type: Number
      },
      biased_sentences: {
        type: [String]
      },
      techniques: {
        type: [String]
      },
      explanation: {
        type: String
      }
    }
  },
  { timestamps: true }
)

export default mongoose.model('analysis', analysisSchema)
