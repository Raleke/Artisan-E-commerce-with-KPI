import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Badge,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  User,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetAdminMetrics } from "../adapters/Requests";

const AdminDashboardPage = () => {
  const { isLoading, data } = useGetAdminMetrics();
  const [metrics, setMetrics] = useState(null);
  const [artisanMetrics, setArtisanMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(data);
    if (data) {
      setMetrics(data);
      // Process artisan data for visualization
      if (data.topArtisans && data.topArtisans.byPerformance) {
        const processedData = data.topArtisans.byPerformance.map((artisan) => ({
          name: `${artisan.firstName} ${artisan.lastName}`,
          completedJobs: artisan.completedJobs || 0,
          averageRating: artisan.averageRating || 0,
        }));
        setArtisanMetrics(processedData);
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="w-2/3"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const jobStatusData = [
    { name: "Open Jobs", value: metrics.jobStatus.openJobs },
    { name: "Closed Jobs", value: metrics.jobStatus.closedJobs },
  ];

  const userDistributionData = [
    { name: "Customers", value: metrics.totalUsers.customers },
    { name: "Employers", value: metrics.totalUsers.employers },
    { name: "Artisans", value: metrics.totalUsers.artisans },
  ];

  // Calculate job application statistics
  const calculateApplicationStats = () => {
    const stats = {
      totalApplications: metrics.applications?.totalApplications,
      pendingApplications: metrics.applications?.pendingApplications,
      employedApplications: metrics.applications?.employedApplications,
      rejectedApplications: metrics.applications?.rejectedApplications,
    };

    return [
      { name: "Employed", value: stats.employedApplications },
      { name: "Pending", value: stats.pendingApplications },
      { name: "Rejected", value: stats.rejectedApplications },
    ];
  };

  const applicationStatusData = calculateApplicationStats();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="flex flex-col p-6 gap-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-5">
            <p className="text-sm text-gray-500">Total Jobs</p>
            <h2 className="text-3xl font-bold">{metrics.totalJobs}</h2>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col items-center justify-center py-5">
            <p className="text-sm text-gray-500">Open Jobs</p>
            <h2 className="text-3xl font-bold">{metrics.jobStatus.openJobs}</h2>
            <p className="text-xs text-gray-400">
              {Math.round(
                (metrics.jobStatus.openJobs / metrics.totalJobs) * 100,
              )}
              % of total
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col items-center justify-center py-5">
            <p className="text-sm text-gray-500">Total Users</p>
            <h2 className="text-3xl font-bold">{metrics.totalUsers.overall}</h2>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col items-center justify-center py-5">
            <p className="text-sm text-gray-500">Artisans</p>
            <h2 className="text-3xl font-bold">
              {metrics.totalUsers.artisans}
            </h2>
            <p className="text-xs text-gray-400">
              {Math.round(
                (metrics.totalUsers.artisans / metrics.totalUsers.overall) *
                  100,
              )}
              % of users
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-80">
          <CardHeader>
            <h3 className="text-lg font-semibold">Job Status Distribution</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="h-80">
          <CardHeader>
            <h3 className="text-lg font-semibold">Application Status</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index + (1 % COLORS.length)]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* User Distribution Chart */}
      <Card className="h-80">
        <CardHeader>
          <h3 className="text-lg font-semibold">User Distribution</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={userDistributionData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Employers Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Top Employers by Jobs Posted
            </h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Top employers by jobs posted">
              <TableHeader>
                <TableColumn>COMPANY</TableColumn>
                <TableColumn>JOBS POSTED</TableColumn>
              </TableHeader>
              <TableBody>
                {metrics.topEmployers.byJobsPosted.map((employer, index) => (
                  <TableRow key={index}>
                    <TableCell>{employer.companyName}</TableCell>
                    <TableCell>
                      <Badge content={employer.jobsPosted} color="primary" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Top Artisans Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Top Artisans by Performance
            </h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Top artisans by performance">
              <TableHeader>
                <TableColumn>ARTISAN</TableColumn>
                <TableColumn>COMPLETED JOBS</TableColumn>
                <TableColumn>RATING</TableColumn>
              </TableHeader>
              <TableBody>
                {metrics.topArtisans.byPerformance.map((artisan, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <User
                        name={`${artisan.firstName} ${artisan.lastName}`}
                        avatarProps={{
                          src: `https://i.pravatar.cc/150?u=${artisan.firstName}${index}`,
                          radius: "full",
                        }}
                      />
                    </TableCell>
                    <TableCell>{artisan.completedJobs || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{(artisan.averageRating || 0).toFixed(1)}</span>
                        <Progress
                          size="sm"
                          value={(artisan.averageRating || 0) * 20}
                          color="warning"
                          className="max-w-24"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Top Artisans by Applications Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Top Artisans by Job Applications
            </h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Top artisans by applications">
              <TableHeader>
                <TableColumn>ARTISAN</TableColumn>
                <TableColumn>APPLICATIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {metrics.topArtisans.byApplications.map((artisan, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <User
                        name={`${artisan._id?.firstName || "Unknown"} ${artisan._id?.lastName || ""}`}
                        avatarProps={{
                          src: `https://i.pravatar.cc/150?u=${artisan._id?.firstName || ""}${index}`,
                          radius: "full",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        content={artisan.applicationCount}
                        color="secondary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Top Employers by Artisans Employed */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Top Employers by Artisans Employed
            </h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Top employers by artisans employed">
              <TableHeader>
                <TableColumn>COMPANY</TableColumn>
                <TableColumn>ARTISANS EMPLOYED</TableColumn>
              </TableHeader>
              <TableBody>
                {metrics.topEmployers.byArtisansEmployed.map(
                  (employer, index) => (
                    <TableRow key={index}>
                      <TableCell>{employer._id || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge
                          content={employer.employedCount}
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default AdminDashboardPage;
