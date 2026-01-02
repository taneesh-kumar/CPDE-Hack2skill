import { Box, Container, Paper, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'

const QA_ITEMS = [
  {
    q: 'How are fields divided into grids?',
    a: [
      'When a field is registered, CPDE uses its geographic boundary to create a grid-based layout over the selected area.',
      'The satellite provides geo-referenced imagery and coordinates, which allow the system to align data accurately on the map. Using this information, CPDE computationally divides the field into smaller grid cells.',
      'Each grid cell is then analyzed independently using satellite-derived vegetation data. This enables detection of localized stress, irrigation imbalance, and uneven growth patterns that may not be visible at the whole-field level.',
    ],
  },
  {
    q: 'What does CPDE actually analyze?',
    a: [
      'CPDE analyzes crop health by studying vegetation behavior patterns captured through satellite imagery.',
      'Instead of waiting for visible damage, it detects early stress signals by observing how plants respond to environmental conditions.',
      'The system works at a grid level, allowing small variations inside a field to be identified early.',
    ],
  },
  {
    q: 'Where does the data come from?',
    a: [
      'In real-world deployment, CPDE uses Sentinel-2 satellite imagery, which provides multispectral data used globally for agricultural monitoring.',
      'For demonstration purposes, sample NDVI values were generated and stored as structured datasets to simulate real satellite behavior.',
    ],
  },
  {
    q: 'What is NDVI and why is it used?',
    a: [
      'NDVI (Normalized Difference Vegetation Index) is a scientific index that measures vegetation health using light reflectance.',
      'Healthy plants reflect more near-infrared light and absorb more red light, producing higher NDVI values.',
      'NDVI helps detect plant stress, reduced growth, early degradation, and uneven vegetation health.',
    ],
    formula: 'NDVI = (NIR − Red) / (NIR + Red)',
  },
  {
    q: 'Why do I see green, yellow, and red zones?',
    a: [
      'CPDE converts NDVI values into simple visual risk zones:',
      '🟢 Green — Healthy zone. Plants show normal growth and stability.',
      '🟡 Yellow — Warning zone. Early stress patterns detected; monitoring recommended.',
      '🔴 Red — High-risk zone. Significant stress detected; attention required.',
      'These colors help users quickly understand field conditions without reading raw data.',
    ],
  },
  {
    q: 'What causes differences between grid zones?',
    a: [
      'Differences between zones may occur due to soil micro-variability, nutrient lock-in or imbalance, uneven irrigation, micro-climate differences, and terrain or shading effects.',
      'These factors influence plant growth differently across short distances.',
    ],
  },
  {
    q: 'Does CPDE directly measure soil, nutrients, or water?',
    a: [
      'No — CPDE does not directly measure soil nutrients, moisture, or irrigation.',
      'Instead, it observes how crops respond to these conditions.',
      'When such factors affect crops, they alter growth patterns, which appear as NDVI variation.',
      'CPDE detects these response patterns and flags them as early risk indicators.',
    ],
  },
  {
    q: 'How does CPDE calculate risk?',
    a: [
      'CPDE uses a weighted risk model that combines multiple indicators. Each component represents a normalized indicator derived from spatial patterns.',
      'This approach helps balance early predictors with visible vegetation response.',
    ],
    formula: 'Final Risk =\n  0.4 × Soil Health Score\n+  0.3 × Moisture Stress\n+  0.2 × Weather Risk\n+  0.1 × Vegetation Health (NDVI-based)',
  },
  {
    q: 'Are the insights real-time?',
    a: [
      'In a production setup, satellite updates would refresh periodically, risk scores update automatically, and insights adapt over time.',
      'In this demo version, pre-generated NDVI samples simulate real-world behavior, but the logic remains identical to live deployment.',
    ],
  },
]

export default function QandA() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Stack spacing={{ xs: 2, md: 2.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: -0.2 }}>
            Q&amp;A
          </Typography>
          <Typography sx={{ mt: 0.25, color: 'text.secondary', fontWeight: 700 }}>
            Quick answers about how CPDE works.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 0,
            borderRadius: '14px',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            boxSizing: 'border-box',
            boxShadow: '0 6px 18px rgba(16,31,22,0.06)',
          }}
        >
          <Box sx={{ p: { xs: 1, sm: 1.5 }, boxSizing: 'border-box' }}>
            {QA_ITEMS.map((item) => (
              <Accordion
                key={item.q}
                disableGutters
                elevation={0}
                sx={{
                  '&:before': { display: 'none' },
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 1.25,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreRoundedIcon />}
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: 'background.paper',
                    '& .MuiAccordionSummary-content': { my: 1 },
                  }}
                >
                  <Typography sx={{ fontWeight: 950 }}>{item.q}</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 2, pb: 2 }}>
                  <Stack spacing={1.25}>
                    {item.a.map((p) => (
                      <Typography key={p} sx={{ color: 'text.secondary', fontWeight: 650, lineHeight: 1.55 }}>
                        {p}
                      </Typography>
                    ))}

                    {item.formula ? (
                      <Box
                        component="pre"
                        sx={{
                          m: 0,
                          p: 1.5,
                          borderRadius: '12px',
                          bgcolor: 'secondary.light',
                          overflowX: 'auto',
                          fontWeight: 900,
                          lineHeight: 1.35,
                          fontSize: 14,
                        }}
                      >
                        {item.formula}
                      </Box>
                    ) : null}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Paper>
      </Stack>
    </Container>
  )
}
