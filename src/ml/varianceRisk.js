import * as tf from '@tensorflow/tfjs'

// TensorFlow.js risk engine (browser-side)
// Input: array of sensor values (e.g., moisture/pH/EC or a derived index per grid cell)
// Output: normalized risk score (0..100) + label
//
// Rationale (hackathon-friendly):
// - Use coefficient of variation (std/mean) to capture unevenness.
// - Add mild trend penalty if the variance is worsening.
// - Clamp to 0..100 for easy farmer comprehension.
export function varianceRiskScore(sensorValues, { previousWindowValues } = {}) {
  if (!Array.isArray(sensorValues) || sensorValues.length < 3) {
    return { score: 0, label: 'Low', details: { reason: 'Not enough data' } }
  }

  const cleaned = sensorValues
    .map((v) => (typeof v === 'number' && Number.isFinite(v) ? v : null))
    .filter((v) => v !== null)

  if (cleaned.length < 3) {
    return { score: 0, label: 'Low', details: { reason: 'Not enough numeric data' } }
  }

  const t = tf.tensor1d(cleaned, 'float32')

  const mean = t.mean()
  const std = tf.moments(t).variance.sqrt()

  const meanVal = mean.dataSync()[0]
  const stdVal = std.dataSync()[0]

  // CV is scale-invariant; protect against mean=0
  const cv = meanVal === 0 ? 0 : stdVal / Math.abs(meanVal)

  // Optional: trend penalty if variance is rising vs previous window
  let trendPenalty = 0
  if (Array.isArray(previousWindowValues) && previousWindowValues.length >= 3) {
    const prev = previousWindowValues
      .map((v) => (typeof v === 'number' && Number.isFinite(v) ? v : null))
      .filter((v) => v !== null)

    if (prev.length >= 3) {
      const prevT = tf.tensor1d(prev, 'float32')
      const prevStd = tf.moments(prevT).variance.sqrt().dataSync()[0]
      prevT.dispose()
      trendPenalty = clamp01((stdVal - prevStd) / (Math.abs(prevStd) + 1e-6))
    }
  }

  // Map to 0..100.
  // Typical CV ranges for noisy sensors might be 0..0.6 (very rough). We map 0.0->0, 0.5->80, 0.7->100.
  const cvScore = clamp01(cv / 0.7)
  const raw = 100 * (0.85 * cvScore + 0.15 * trendPenalty)
  const score = Math.round(clamp(raw, 0, 100))

  const label = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'

  t.dispose()
  mean.dispose()
  std.dispose()

  return {
    score,
    label,
    details: {
      mean: round2(meanVal),
      std: round2(stdVal),
      cv: round3(cv),
      trendPenalty: round3(trendPenalty),
    },
  }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function clamp01(v) {
  return clamp(v, 0, 1)
}

function round2(v) {
  return Math.round(v * 100) / 100
}

function round3(v) {
  return Math.round(v * 1000) / 1000
}
