import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class RadarComponent implements AfterViewInit {
  dataObject = [{
    id: 1,
    question: 'Life long learning',
    score: 8,
    comment: 'This is comment for question 1'
  }, {
    id: 2,
    question: 'Problem Analysis',
    score: 7,
    comment: 'This is comment for question 2'
  }, {
    id: 3,
    question: 'Disciplinary Knowledge',
    score: 9,
    comment: 'This is comment for question 3'
  }, {
    id: 4,
    question: 'Adaptability and Cultural Awareness',
    score: 8,
    comment: 'This is comment for question 4'
  }, {
    id: 5,
    question: 'Technology / Domain-Specific Knowledge',
    score: 5,
    comment: 'This is comment for question 5'
  }, {
    id: 6,
    question: 'Problem Solution and Decision Making',
    score: 10,
    comment: 'This is comment for question 6'
  }]

  radarChartLabels: string[] = [];
  radarChartData: number[] = [];

  constructor() {
    Chart.register(...registerables)
  }

  ngAfterViewInit(): void {
    this.initializeRadarChart();
  }

  radarChart: Chart | undefined

  formatRadaChartData(): void {
    this.radarChartLabels = []

    this.dataObject.forEach(feedback => {
      this.radarChartLabels.push(feedback.question);
      this.radarChartData.push(feedback.score);
    });
  }

  initializeRadarChart(): void {
    this.formatRadaChartData()

    this.radarChart = new Chart("radarChart", {
      type: 'radar',
      data: {
        labels: this.radarChartLabels,
        datasets: [{
          label: 'John Doe',
          data: this.radarChartData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        elements: {
          line: {
            borderWidth: 3
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false, // Disable the default tooltip
            // external: this.customTooltip, // Use the custom tooltip function
            external: (context) => this.customTooltip(context, this.dataObject),
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 12, // Adjust tick font size
              },
              backdropPadding: 8, // Adds padding between ticks
            },
            pointLabels: {
              font: {
                size: 12, // Adjust font size if necessary
              },
              callback: (label) => {
                // Split label into multiple lines (e.g., every 20 characters)
                const maxLineLength = 20;
                const words = label.split(' ');
                const lines = [];
                let currentLine = '';

                words.forEach((word) => {
                  if ((currentLine + word).length > maxLineLength) {
                    lines.push(currentLine);
                    currentLine = word;
                  } else {
                    currentLine += (currentLine.length ? ' ' : '') + word;
                  }
                });

                if (currentLine.length) {
                  lines.push(currentLine);
                }

                return lines; // Return an array of lines for wrapping
              },
            },
          },
        }
      },
    })
  }
  customTooltip(context: any, dataObject: any[]) {
    const tooltipEl = document.getElementById('customTooltip');

    // Hide tooltip if nothing is active
    const tooltipModel = context.tooltip;
    if (!tooltipModel || tooltipModel.opacity === 0) {
      tooltipEl!.style.opacity = '0';
      tooltipEl!.style.display = 'none';
      return;
    }

    // Set the text for the tooltip
    const dataIndex = tooltipModel.dataPoints[0].dataIndex;
    const label = tooltipModel.dataPoints[0].label;
    const value = tooltipModel.dataPoints[0].raw;

    let comment = dataObject.find(feedback => feedback.question == label)?.comment
    let scoreClass = 'low-score'

    if (value >= 7) {
      scoreClass = 'high-score'
    }

    if (value < 7 && value >= 4) {
      scoreClass = 'medium-score'
    }

    tooltipEl!.innerHTML = `
      <div class="title">${label}</div>
      <div class="`+ scoreClass + `">${value}/10</div>
      <div class="comment">"${comment}"</div>
    `;

    // Position the tooltip
    const chartCanvas = context.chart.canvas.getBoundingClientRect();
    const tooltipX = chartCanvas.left + tooltipModel.caretX;
    const tooltipY = chartCanvas.top + tooltipModel.caretY;

    tooltipEl!.style.left = `${tooltipX}px`;
    tooltipEl!.style.top = `${tooltipY}px`;
    tooltipEl!.style.opacity = '1';
    tooltipEl!.style.display = 'block';
  }
}
