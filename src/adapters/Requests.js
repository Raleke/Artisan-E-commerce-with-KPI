import { apiClient, apiClientPrivate, queryClient } from "./api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate, useLocation } from "react-router";
import { GetUserId, handleError } from "./utils";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "sonner";

function useEmployerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/employer/dashboard";
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: (formData) => {
      return apiClient.post("/employer/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (res) => {
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      // Extract user ID from decoded token
      const employer = res.data.employer;
      console.log(employer);
      setAuth({ type: "employer", employer, token });
      queryClient.invalidateQueries("userdata"); // Invalidate the user query
      // Redirect to dashboard after successful login
      navigate(from, { replace: true });
    },
    onError: (error) => {
      handleError(error);
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "your email has not been verified"
      ) {
        navigate(`/verify/email/${error.response.data.email}`);
      }
    },
  });
}

function useAdminLogin() {
  const navigate = useNavigate();
  const from = "/admin/dashboard";
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: (formData) => {
      return apiClient.post("/admin/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (res) => {
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      const employer = res.data.admin;
      // Extract user ID from decoded token
      setAuth({ type: "admin", employer, token });
      queryClient.invalidateQueries("userdata"); // Invalidate the user query
      // Redirect to dashboard after successful login
      navigate(from, { replace: true });
    },
    onError: (error) => {
      handleError(error);
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "your email has not been verified"
      ) {
        navigate(`/verify/email/${error.response.data.email}`);
      }
    },
  });
}
function useCustomerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/customer/dashboard";
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: (formData) => {
      return apiClient.post("/customer/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (res) => {
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      const employer = res.data.customer;
      // Extract user ID from decoded token
      setAuth({ type: "customer", employer, token });
      queryClient.invalidateQueries("userdata"); // Invalidate the user query
      // Redirect to dashboard after successful login
      navigate(from, { replace: true });
    },
    onError: (error) => {
      handleError(error);
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "your email has not been verified"
      ) {
        navigate(`/verify/email/${error.response.data.email}`);
      }
    },
  });
}
function useEmployerSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post(`employer/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Signup successful, please login");
      navigate(`/login/employer/`);
    },
  });
}
function useCustomerSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post(`customer/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Signup successful, please login");
      navigate(`/login/customer/`);
    },
  });
}

function usePostContactArtisan(employerId, artisanId) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post(
        `employer/contact-artisan/${employerId}/${artisanId}`,
        formData,
      );

      return response.data;
    },
  });
}

function usePostEmployerJob() {
  const apiClientPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await apiClientPrivate.post("/job/add-job", formData);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Job posted successfully");
      navigate(`/job/${data.job._id}`);
    },
  });
}
function useGetEmployerProfile(id) {
  return useQuery({
    queryKey: ["employer", id],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      try {
        const res = await apiClient.get(`/employer/profile/${id}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 120000,
  });
}

function useGetCustomerProfile(id) {
  return useQuery({
    queryKey: ["employer", id],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      try {
        const res = await apiClient.get(`/customer/profile/${id}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 120000,
  });
}

function useGetJobApplications(jobId) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["applications", jobId],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get(
          `/employer/${jobId}/applications`,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },

    staleTime: 50000,
  });
}
function useGetAllEmployerApplications() {
  const apiClientPrivate = useAxiosPrivate();
  const { user } = useAuth();
  return useQuery({
    queryKey: ["jobs", "all"],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get(
          `/employer/employer/applications/${user.id}`,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },

    staleTime: 50000,
  });
}

function usePatchApplicationStatus(jobId, artisanId) {
  return useMutation({
    mutationFn: async (status) => {
      try {
        const res = await apiClient.patch(
          `/employer/${jobId}/applications/${artisanId}`,
          status,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      toast.success("Application status updated successfully");
      queryClient.invalidateQueries(["jobs"]);
    },
  });
}
function usePatchArtisanProfile(id) {
  return useMutation({
    mutationFn: async (profileData) => {
      try {
        const res = await apiClient.put(
          `/artisan/update-profile/${id}`,
          profileData,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["artisanProfile"]);
    },
  });
}

function useGetEmployerNotifications(id) {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      try {
        const res = await apiClient.get(`/employer/notifications/${id}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 4000,
  });
}

function useGetALLJobs(mode = "all") {
  const { user_type, user } = useAuth();
  const apiClientPrivate = useAxiosPrivate();
  if (user_type == "artisan" && mode == "special") {
    return useQuery({
      queryKey: ["jobs", mode],

      queryFn: async () => {
        try {
          const res = await apiClientPrivate.get(`/artisan/jobs/${user.id}`);
          return res.data;
        } catch (error) {
          handleError(error);
        }
      },

      staleTime: 50000,
    });
  }
  return useQuery({
    queryKey: ["jobs", "all"],

    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get(`/job/all`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },

    staleTime: 50000,
  });
}
function useGetJobDetails(jobId) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get(`/job/get/${jobId}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },

    staleTime: 50000,
  });
}

function UseArtisanSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post(`artisan/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Signup successful, please login");

      navigate("/login/artisan");
    },
  });
}

function useArtisanLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/artisan/dashboard";
  const { auth, setAuth } = useAuth();
  return useMutation({
    mutationFn: (formData) => {
      return apiClient.post("/artisan/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (res) => {
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      // Extract user ID from decoded token
      const employer = res.data.artisan;
      console.log(employer);
      setAuth({ type: "artisan", employer, token });
      console.log(auth);
      queryClient.invalidateQueries("userdata"); // Invalidate the user query
      // Redirect to dashboard after successful login
      toast.success("Login successful");
      navigate(from, { replace: true });
    },
    onError: (error) => {
      handleError(error);
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "your email has not been verified"
      ) {
        navigate(`/verify/email/${error.response.data.email}`);
      }
    },
  });
}

function useGetArtisanFullDetails(artisanId) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["artisan", artisanId],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get(`/artisan/profile/${artisanId}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },

    staleTime: 50000,
  });
}

function useGetArtisanApplications() {
  const apiClientPrivate = useAxiosPrivate();
  const { user } = useAuth();
  return useQuery({
    queryKey: ["applications", "profile"],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get(
          `/artisan/artisan/applied-jobs/${user.id}`,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },

    staleTime: 50000,
  });
}
function usePostArtisanApply() {
  const apiClientPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await apiClientPrivate.post("/job/apply-job", formData);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: (data) => {
      toast.success("Application successful");
    },
  });
}

function useGetJobDetailsApplications(jobId) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get(
          `/employer/${jobId}/applications`,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
  });
}

function useDeleteJob() {
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await apiClientPrivate.delete(`/job/delete/${id}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries("jobs");
    },
  });
}
function useLeaveReview() {
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async (reviewData) => {
      try {
        const res = await apiClientPrivate.post(
          "/review/leave-review",
          reviewData,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries(["reviews"]);
    },
  });
}

function useEditReview() {
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async ({ reviewId, reviewData }) => {
      try {
        const res = await apiClientPrivate.put(
          `/review/edit-review/${reviewId}`,
          reviewData,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      toast.success("Review updated successfully");
      queryClient.invalidateQueries(["reviews"]);
    },
  });
}

function useGetAllArtisans() {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["artisans", "all"],
    queryFn: async () => {
      const res = await apiClientPrivate.get(`/artisan/all`);
      return res.data;
    },
  });
}

function useDeleteReview() {
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async (reviewId) => {
      try {
        const res = await apiClientPrivate.delete(
          `/review/delete-review/${reviewId}`,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries(["reviews"]);
    },
  });
}

function useGetArtisansToRate(employerId) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["reviews", employerId],
    queryFn: async () => {
      if (!employerId) return null;
      try {
        const res = await apiClientPrivate.get(
          `/review/artisans-to-rate/${employerId}`,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 60000,
  });
}
function useGetArtisansToRateCustomer(employerId) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["reviews", employerId],
    queryFn: async () => {
      if (!employerId) return null;
      try {
        const res = await apiClientPrivate.get(
          `/review/artisans-to-rate-customer/${employerId}`,
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 60000,
  });
}

function useGetEmployersToRate(artisanId) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["reviews", artisanId],
    queryFn: async () => {
      if (!artisanId) return null;
      try {
        const res = await apiClientPrivate.get(
          `/review/employers-to-rate/${artisanId}`,
        );
        console.log(res);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 60000,
  });
}
function useGetAdminMetrics() {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["admin", "metics"],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get("/admin/metrics");
        console.log(res.data);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 5000,
  });
}

export {
  useEmployerLogin,
  useEmployerSignup,
  usePostContactArtisan,
  useGetEmployerProfile,
  useGetAllEmployerApplications,
  useGetJobApplications,
  usePostEmployerJob,
  useGetJobDetails,
  usePatchApplicationStatus,
  useGetEmployerNotifications,
  useArtisanLogin,
  UseArtisanSignup,
  useGetALLJobs,
  useGetArtisanFullDetails,
  useGetArtisanApplications,
  usePostArtisanApply,
  useDeleteJob,
  useGetJobDetailsApplications,
  usePatchArtisanProfile,
  useLeaveReview,
  useEditReview,
  useDeleteReview,
  useGetArtisansToRate,
  useGetEmployersToRate,
  useAdminLogin,
  useGetAdminMetrics,
  useCustomerSignup,
  useCustomerLogin,
  useGetAllArtisans,
  useGetCustomerProfile,
  useGetArtisansToRateCustomer,
};
