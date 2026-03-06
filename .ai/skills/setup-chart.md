# SKILL: Setup Chart.js Component

# INSTRUCTIONS
When creating a chart (Dashboard):

1. **Dependencies:**
   - Use `vue-chartjs` and `chart.js`.
   
2. **Registration:**
   - Always register components manually in the `<script setup>` or a composable:
   ```javascript
   import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
   ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)```