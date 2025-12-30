import { InferenceClient } from '@huggingface/inference'
import Analysis from '../models/analysis.js'
import { scrapeArticle } from '../utils/scrapeArticle.js'
import { parseAnalysis } from '../utils/parseAnalysis.js'

const hf = new InferenceClient(process.env.HF_TOKEN)


export async function analyzeText(req, res) {
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ error: 'Text required' })
  }

  try {
    const response = await hf.chatCompletion({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [
        { role: 'system', content: process.env.ANALYSIS },
        {
          role: 'user',
          content: `Analyze the following text:\n"""${text}"""`
        }
      ],
      temperature: 0.2,
      max_tokens: 400
    })

    const rawOutput = response.choices[0].message.content

    
    const result = parseAnalysis(rawOutput)

    await Analysis.create({
      type: 'text',
      input: text,
      raw_output: rawOutput,
      result
    })

    res.json(result)

  } catch (err) {
    console.error('TEXT ANALYSIS ERROR:', err)
    res.status(500).json({ error: 'Text analysis failed' })
  }
}

export async function analyzeUrl(req, res) {
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ error: 'URL required' })
  }

  try {
    const articleText = await scrapeArticle(url)

    const response = await hf.chatCompletion({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [
        { role: 'system', content: process.env.ANALYSIS },
        {
          role: 'user',
          content: `Analyze the following article:\n"""${articleText}"""`
        }
      ],
      temperature: 0.2,
      max_tokens: 400
    })

    const rawOutput = response.choices[0].message.content

 
    const result = parseAnalysis(rawOutput)

    await Analysis.create({
      type: 'url',
      input: url,
      raw_output: rawOutput,
      result
    })

    res.json(result)

  } catch (err) {
    console.error('URL ANALYSIS ERROR:', err)
    res.status(500).json({ error: 'URL analysis failed' })
  }
}
