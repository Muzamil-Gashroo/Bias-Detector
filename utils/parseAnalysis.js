export function parseAnalysis(text) {
  const result = {
    bias_level: null,
    confidence: null,
    biased_sentences: [],
    techniques: [],
    explanation: ''
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  let currentSection = null

  for (const line of lines) {
    if (line.startsWith('Bias Level:')) {
      result.bias_level = line.replace('Bias Level:', '').trim()
    }
    else if (line.startsWith('Confidence:')) {
      result.confidence = parseInt(
        line.replace('Confidence:', '').trim(),
        10
      )
    }
    else if (line === 'Biased Sentences:') {
      currentSection = 'biased_sentences'
    }
    else if (line === 'Techniques:') {
      currentSection = 'techniques'
    }
    else if (line === 'Explanation:') {
      currentSection = 'explanation'
    }
    else if (line.startsWith('-') && currentSection) {
      result[currentSection].push(
        line.replace(/^-/, '').trim()
      )
    }
    else if (currentSection === 'explanation') {
      result.explanation += line + ' '
    }
  }

  
  result.confidence = Math.max(0, Math.min(100, result.confidence || 0))

  return result
}
