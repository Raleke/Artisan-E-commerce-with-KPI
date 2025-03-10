import { apiClient, queryClient } from "./api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate, useLocation } from "react-router";
import { GetUserId, handleError } from "./utils";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

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
      navigate(`/verify/email/`);
    },
  });
}

function UsePostContactArtisan(employerId, artisanId) {
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

function UseGetEmployerProfile(id) {
  return useQuery({
    queryKey: ["userdata", id],
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
      queryClient.invalidateQueries(["applications", jobId]);
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
  const { type } = useAuth();
  const apiClientPrivate = useAxiosPrivate();
  if (type == "artisan" && mode == "special") {
    return useQuery({
      queryKey: ["jobs", mode],

      queryFn: async () => {
        try {
          const res = await apiClientPrivate.get(`/artisan/jobs`);
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
      navigate(`/verify/email/`);
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
  });
}

export {
  useEmployerLogin,
  useEmployerSignup,
  UsePostContactArtisan,
  UseGetEmployerProfile,
  useGetAllEmployerApplications,
  useGetJobApplications,
  useGetJobDetails,
  usePatchApplicationStatus,
  useGetEmployerNotifications,
  useArtisanLogin,
  UseArtisanSignup,
  useGetALLJobs,
  useGetArtisanFullDetails,
  useGetArtisanApplications,
  usePostArtisanApply,
};
