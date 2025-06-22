"use client";

import Image from "next/image";
import logo from "../../../../public/images/logos/logo1.jpg";
import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const [dataBar, setDataBar] = useState([]);
  const [dataPie, setDataPie] = useState({});
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // URLs
  const currentYear = new Date().getFullYear();
  const salesDataUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/get-sales-per-month?year=${currentYear}`;
  const productSalesUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/get-product-sales?year=${currentYear}`;
  const lowStockUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/get-low-stock-products`;
  console.log('lowStockUrl', lowStockUrl)
  // Fetch functions
  const fetchSalesData = async () => {
    console.log('fetchSalesData')
    try {
      const response = await fetch(salesDataUrl);
      const data = await response.json();
      setDataBar(data.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const fetchProductSalesData = async () => {
    console.log('fetchProductSalesData');
    try {
      const response = await fetch(productSalesUrl);
      console.log('first');
      const data = await response.json();
      console.log('dataxx: ', data);
      setDataPie(data.data);
    } catch (error) {
      console.error("Error fetching product sales data:", error);
    }
  };

  const fetchLowStockProducts = async () => {
    console.log('fetchLowStockProducts')
    try {
      const response = await fetch(lowStockUrl);
      const data = await response.json();
      console.log('data.data', data.data)
      setLowStockProducts(data.data);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
    fetchProductSalesData();
    fetchLowStockProducts();

    // disable eslint
    // eslint-disable-next-line 
  }, []);

  // Prepare bar chart data
  const chartData = {
    labels: dataBar.map((item) => item.month),
    datasets: [
      {
        label: "Penjualan tahun "  + currentYear,
        data: dataBar.map((item) => item.total_sales),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
  };

  // Prepare pie chart data
  const pieChartData = {
    labels: Object.keys(dataPie),
    datasets: [
      {
        label: "Produk Terjual Tahun " + currentYear,
        data: Object.values(dataPie),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 10,
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: "Produk Terjual Tahun " + currentYear,
      },
    },
  };


  return (
    <div className="flex flex-col mx-auto max-h-full min-h-screen">
      <Header logo={logo} />
      <div className="flex flex-row h-full">
        <SideBar setActiveMenu={setActiveMenu} />
        <div className="p-5 w-full">
          <h1 className="font-bold text-3xl mb-5">Dashboard</h1>
          <div className="flex flex-row justify-start items-center gap-5">
            {/* Pie Chart Section */}
            <div className="bg-white p-5 border border-gray-300 shadow-lg rounded h-[400px] min-h-[400px] max-h-[400px] overflow-hidden min-w-[300px]">
              {/* <h2 className="text-xl font-bold">Produk terjual tahun {currentYear}</h2> */}
              {Object.keys(dataPie).length > 0 ? (
                <Pie data={pieChartData} options={pieChartOptions} />
              ) : (
                <div className="animate-pulse flex flex-col items-center justify-center h-full">
                  <div className="bg-gray-200 rounded w-24 h-4 mb-4"></div>
                  <div className="bg-gray-200 rounded w-24 h-4 mb-4"></div>
                  <div className="bg-gray-200 rounded-full w-32 h-32"></div>
                </div>
              )}
            </div>

            {/* Low Stock Products Section */}
            <div className="bg-white p-5 border border-gray-300 shadow-lg rounded h-[400px] min-h-[400px] max-h-[400px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-3">
                {lowStockProducts.length} Produk Aktif Dengan Stok Rendah <sup className="text-red-500 text-xs">* (Stok kurang dari 3)</sup>
              </h2>
              {lowStockProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockProducts.map((product) => {
                    const imageUrl =
                      product.Images && product.Images[0]
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.Images[0]?.image}`
                        : "https://placehold.co/600x600?text=Image+Not+Found";

                    return (
                      <div
                        key={product.id_product}
                        className="border rounded-lg shadow p-4 flex flex-col items-center"
                      >
                        <Image
                          width={14}
                          height={14}
                          alt={product.product_name}
                          className="w-14 h-14 object-cover mb-3 rounded"
                          src={imageUrl}
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/600x600?text=Image+Not+Found";
                          }}
                          unoptimized={true}
                        />
                        <h3 className="font-semibold text-center">{product.product_name}</h3>
                        <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="border rounded-lg shadow p-4 flex flex-col items-center animate-pulse"
                    >
                      <div className="bg-gray-200 rounded-full w-14 h-14 mb-3"></div>
                      <div className="bg-gray-200 rounded w-20 h-4 mb-1"></div>
                      <div className="bg-gray-200 rounded w-16 h-4"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          <div className="bg-white p-5 shadow rounded mt-5">
            <h2 className="text-xl font-bold mb-3">Data Penjualan</h2>
            {dataBar.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="animate-pulse flex flex-col items-center justify-center h-[400px]">
                <div className="bg-gray-200 rounded w-full h-6 mb-4"></div>
                <div className="bg-gray-200 rounded w-[80%] h-6 mb-4"></div>
                <div className="bg-gray-200 rounded w-[70%] h-6 mb-4"></div>
                <div className="bg-gray-200 rounded w-[60%] h-6 mb-4"></div>
                <div className="bg-gray-200 rounded w-[90%] h-6"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
