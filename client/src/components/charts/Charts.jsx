/* eslint-disable react/prop-types */
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = ({dataList}) => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const month = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    ).toLocaleString("default", { month: "short" });
    months.push(month);
  }

  const data = {
    labels: months,
    datasets: [
      {
        data: dataList,
        fill: true,
        backgroundColor: "#0abff7",
        borderColor: "#0abff7",
        tension: 0.4,
        pointBackgroundColor: "#0abff7",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#3f89fc",
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        categoryPercentage: 0.8,
        barPercentage: 0.6,
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Yearly Earnings",
        align: "start",
        padding: {
          bottom: 30,
        },
        font: {
          size: 17,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (tooltipItems) => {
            return `Month: ${tooltipItems[0].label}`;
          },
          label: (tooltipItem) => {
            return `Earning: ${tooltipItem.raw}`;
          },
        },
      },
    },
    hover: {
      mode: "nearest",
      intersect: false,
    },
  };

  return (
    <div className="chart" style={{ width: "100%", height: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

const getLastWeekLabels = () => {
  const labels = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    labels.push(day.toLocaleDateString("default", { weekday: "short" }));
  }
  return labels;
};

export const BarChart = ({dataList}) => {
  const labels = getLastWeekLabels();

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataList,
        backgroundColor: "#408afd",
        borderRadius: 10,
        borderSkipped: false,
        barThickness: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Weekly Earnings",
        align: "start",
        padding: {
          bottom: 30,
        },
        font: {
          size: 17,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (tooltipItems) => {
            return `Day: ${tooltipItems[0].label}`;
          },
          label: (tooltipItem) => {
            return `Earning: ${tooltipItem.raw}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        categoryPercentage: 0.8,
        barPercentage: 0.6,
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart" style={{ width: "100%", height: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
};
