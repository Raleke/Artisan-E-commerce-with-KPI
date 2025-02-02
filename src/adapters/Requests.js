import { apiClient, queryClient } from "./api";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { GetUserId, handleError } from "./utils";
import useAuth from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "sonner";

function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: (formData) => {
      return apiClient.post("users/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      // Extract user ID from decoded token
      const userId = decodedToken.userId;
      setAuth({ userId, token });
      queryClient.invalidateQueries("userdata"); // Invalidate the user query
      // Redirect to dashboard after successful login
      navigate(from, { replace: true });
    },
    onError: (error) => {
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

function UseSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post(`users/signup`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      if (!data || !data.email) {
        console.error("Invalid data received:", data);
        return;
      }
      queryClient.invalidateQueries("userdata");
      toast.success("You have been successfully registered.");
      navigate(`/verify/email/${data.email}`);
    },
  });
}

function useLogout() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async () => {
      try {
        const res = await apiClientPrivate.get("/users/logout");
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      setAuth({});
      queryClient.invalidateQueries();
      navigate("/", { replace: true });
    },
  });
}
function UseGetIsUserVerified(email) {
  return useQuery({
    queryKey: ["userdata", email],
    queryFn: async () => {
      if (!email) {
        return null;
      }
      try {
        const res = await apiClient.get(`users/verify/status/${email}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 120000,
  });
}

function UsePostRefeshToken() {
  return useMutation({
    mutationFn: async ({ email }) => {
      try {
        const response = await apiClient.post(`users/verify/resend/${email}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Email Successfully Sent.");
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
  });
}
function UseHandleVerifyToken() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: async ({ email, token }) => {
      return apiClient.post(`users/verify/email/${email}/${token}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      console.log(res.data);
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      // Extract user ID from decoded token
      const userId = decodedToken.userId;
      setAuth({ userId, token });
      queryClient.invalidateQueries("userdata"); // Invalidate the user query
      // Redirect to dashboard after successful login
      navigate(from, { replace: true });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "An error occurred");
      if (error.response?.data?.error === "no token of the such exists") {
        return navigate(`/sign-up`);
      }
      if (error.response?.status == 401) {
        return navigate(`/verify/email/${error.response.data.email}`, {
          replace: true,
        });
      }
      return;
    },
    retry: 2,
  });
}
function UsePostResetToken() {
  return useMutation({
    mutationFn: async ({ email }) => {
      try {
        const response = await apiClient.post(`users/reset/email/${email}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Email Successfully Sent.");
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
  });
}
function UseHandleResetToken() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ token, formData }) => {
      const response = await apiClient.post(
        `users/reset/password/${token}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      navigate("/log-in", { replace: true });
    },
  });
}

function useOpenings() {
  const apiClientPrivate = useAxiosPrivate();
  const [search] = useSearchParams();
  let page = parseInt(search.get("page")) || 1;
  search.delete("page");
  return useQuery({
    queryKey: ["openings", search.toString(), page],
    queryFn: () =>
      apiClientPrivate
        .get("vacancies", {
          params: search,
        })
        .then((res) => res.data),
    placeholderData: keepPreviousData,

    staleTime: 50000,
  });
}

function UseUserinfo() {
  const userId = GetUserId();
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["userdata", userId],
    queryFn: async () => {
      if (!userId) {
        return null;
      }
      try {
        const res = await apiClientPrivate.get(`users/${userId}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000000,
  });
}

function UsePostinfo() {
  const userId = GetUserId();
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async (formData) => {
      const response = await apiClientPrivate.post(
        `users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("userdata");
    },
    onError: (error) => {
      handleError(error);
    },
  });
}
function UsePostAcademicInformation() {
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async ({ application_id, formData }) => {
      try {
        const response = await apiClientPrivate.post(
          `apply/academic/${application_id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("application");
    },
  });
}
function useApplicationInfo(application_id) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["application", application_id],
    queryFn: async () => {
      if (!application_id) {
        return null;
      }
      try {
        const res = await apiClientPrivate.get(`application/${application_id}`);

        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000,
  });
}
function useApplicationAll() {
  const apiClientPrivate = useAxiosPrivate();
  const user_id = GetUserId();
  return useQuery({
    queryKey: ["applications", user_id],
    queryFn: async () => {
      if (!user_id) {
        return null;
      }
      try {
        const res = await apiClientPrivate.get(`application/all/${user_id}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000,
  });
}

function UseAcademicInfo(application_id) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["application", application_id, "academic"],
    queryFn: async () => {
      if (!application_id) {
        return null;
      }
      try {
        const res = await apiClientPrivate.get(
          `apply/academic/${application_id}`
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000000,
  });
}
function usePostNextofKinInfo({ application_id }) {
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async ({ application_id, formData }) => {
      try {
        const response = await apiClientPrivate.post(
          `apply/nextofkin/${application_id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Handle successful response, e.g., return data or handle redirects
        return response.data;
      } catch (error) {
        // Handle errors more specifically, e.g., display error messages or log details
        handleError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("application"); // Assuming 'application' is the query key
    },
  });
}
function useGetNextofKinInfo(application_id) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["application", application_id, "nextofkin"],
    queryFn: async () => {
      if (!application_id) {
        return null;
      }
      try {
        const res = await apiClientPrivate.get(
          `apply/nextofkin/${application_id}`
        );

        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000000,
  });
}
function useGetDocumentRequired(vacancy_id) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["application", vacancy_id, "documents types"],
    queryFn: async () => {
      if (!vacancy_id) {
        return null;
      }
      try {
        const res = await apiClientPrivate.get(
          `apply/documents/types/${vacancy_id}`
        );

        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000000,
  });
}
function useGetApplicationDocuments(application_id) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["application", application_id, "documents"],
    queryFn: async () => {
      if (!application_id) {
        return null;
      }
      try {
        const res = await apiClientPrivate.get(
          `apply/documents/${application_id}`
        );

        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000000,
  });
}

function usePostDocumentUpload() {
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async ({ id, application_id, formData }) => {
      try {
        const response = await apiClientPrivate.post(
          `/apply/documents/create/${id}/${application_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("application");
    },
  });
}
function usePostRefereeInformation() {
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async ({ application_id, formData }) => {
      try {
        const response = await apiClientPrivate.post(
          `/apply/referee/${application_id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("application");
    },
  });
}
function useRefereeInformation(application_id) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["application", application_id, "referee"],
    queryFn: async () => {
      if (!application_id) {
        return null;
      }
      try {
        const res = await apiClientPrivate.get(
          `apply/referee/${application_id}`
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000000,
  });
}

function useCreateApplication() {
  const apiClientPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const userId = GetUserId();
  return useMutation({
    mutationFn: async ({ vacancy_id, application_type }) => {
      try {
        const response = await apiClientPrivate.post(
          `application/${userId}/${vacancy_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data["message"] == "successful") {
          toast.success("Your Application has been successfully created.");
          return navigate(
            `/apply/${application_type}/${vacancy_id}/${response.data["application_id"]}`
          );
        }
      } catch (error) {
        handleError(error);
      }
    },
  });
}
function useSubmitApplication() {
  const apiClientPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ vacancy_id, application_type, application_id }) => {
      try {
        const response = await apiClientPrivate.post(
          `application/submit/${application_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data["message"] == "successful") {
          toast.success("Your Application has been successfully submitted.");
          return navigate(
            `/apply/review/${application_type}/${vacancy_id}/${application_id}`
          );
        }
      } catch (error) {
        handleError(error);
      }
    },
  });
}
function usePostNdeacademicainformation() {
  const apiClientPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async ({ application_id, formData }) => {
      try {
        const response = await apiClientPrivate.post(
          `apply/academic/nde/${application_id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;

      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("application");
    },
  });
}

function useGetNdeacademicinformation(application_id) {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["application", application_id, "academic"],
    queryFn: async () => {
      if (!application_id) {
        return null;
      }
      try {
        const res = await apiClientPrivate.get(
          `apply/academic/nde/${application_id}`
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    // staleTime: 100000000,
  });
}
function useGetSchools() {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["school"],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get(`info/school`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000000,
  });
}
function useGetLocations() {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get("info/location");
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
    staleTime: 100000000,
  });
}
function useGetCourses() {
  const apiClientPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["cousres"],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get("info/courses");
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
  });
}

export {
  useOpenings,
  useLogin,
  UseSignup,
  useLogout,
  UseUserinfo,
  UseGetIsUserVerified,
  UsePostRefeshToken,
  UseHandleVerifyToken,
  UsePostResetToken,
  UseHandleResetToken,
  UsePostinfo,
  useApplicationInfo,
  useApplicationAll,
  UsePostAcademicInformation,
  UseAcademicInfo,
  useGetDocumentRequired,
  useGetApplicationDocuments,
  usePostDocumentUpload,
  usePostRefereeInformation,
  useRefereeInformation,
  useCreateApplication,
  useSubmitApplication,
  usePostNextofKinInfo,
  useGetNextofKinInfo,
  usePostNdeacademicainformation,
  useGetNdeacademicinformation,
  useGetSchools,
  useGetLocations,
  useGetCourses,
};
