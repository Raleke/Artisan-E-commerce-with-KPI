import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Textarea,
} from "@heroui/react";
import { FaEdit, FaStar, FaTrash } from "react-icons/fa";
import {
  useDeleteReview,
  useGetEmployersToRate,
  useEditReview,
  useLeaveReview,
  useGetArtisanFullDetails,
} from "../adapters/Requests";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

const ArtisanReviewsPage = () => {
  const { user } = useAuth();
  const { data: profileData, isLoading } = useGetArtisanFullDetails(user?.id);
  const { data: employersToRate, isLoading: employersLoading } =
    useGetEmployersToRate(user?.id);
  const leaveReviewMutation = useLeaveReview();
  const editReviewMutation = useEditReview();
  const deleteReviewMutation = useDeleteReview();
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmitReview = () => {
    if (!selectedEmployer || !selectedJob || rating === 0) {
      toast.error("Please select an employer, job, and provide a rating");
      return;
    }

    if (editingReview) {
      editReviewMutation.mutate(
        {
          reviewId: editingReview._id,
          reviewData: { rating, comment },
        },
        {
          onSuccess: () => resetReviewForm(),
        },
      );
    } else {
      leaveReviewMutation.mutate(
        {
          reviewerId: user.id,
          reviewerType: "Artisan",
          recipientId: selectedEmployer.employer._id,
          recipientType: "Employer",
          jobId: selectedJob.jobId,
          rating,
          comment,
        },
        {
          onSuccess: () => resetReviewForm(),
        },
      );
    }
  };

  const resetReviewForm = () => {
    setSelectedEmployer(null);
    setSelectedJob(null);
    setRating(0);
    setComment("");
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment || "");

    // Find the corresponding employer and job
    const employer = employersToRate?.find(
      (e) => e.employer._id === review.recipientId,
    );
    setSelectedEmployer(employer);

    const job = employer?.jobs.find((j) => j.jobId === review.jobId);
    setSelectedJob(job);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReviewMutation.mutate(reviewId);
    }
  };
  console.log(profileData);

  if (isLoading || employersLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Your Reviews</h2>
        </CardHeader>
        <CardBody>
          {profileData.artisan.reviews &&
          profileData.artisan.reviews.length > 0 ? (
            <div className="space-y-4">
              {profileData.artisan.reviews.map((review) => (
                <div key={review._id} className="p-4 border rounded">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{review.recipientName}</h3>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {review.comment || "No comment provided"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditReview(review)}
                        color="primary"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteReview(review._id)}
                        color="danger"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't left any reviews yet.</p>
          )}
        </CardBody>
      </Card>

      <div>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {editingReview ? "Edit Review" : "Leave a New Review"}
            </h2>
          </CardHeader>
          <CardBody>
            {employersLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : employersToRate?.length === 0 ? (
              <p>No employers to review at this time.</p>
            ) : (
              <>
                {!selectedEmployer && (
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">
                      Select an Employer
                    </label>
                    <div className="space-y-2">
                      {employersToRate?.map((item) => (
                        <div
                          key={item.employer._id}
                          className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            console.log(item);
                            setSelectedEmployer(item);
                            setSelectedJob(null);
                          }}
                        >
                          <h3 className="font-medium">
                            {item.employer.CompanyName ||
                              item.employer.companyName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.employer.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEmployer && !selectedJob && (
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <label className="font-medium">Select a Job</label>
                      <Button
                        color="primary"
                        onClick={() => setSelectedEmployer(null)}
                      >
                        Change Employer
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedEmployer.jobs.map((job) => (
                        <div
                          key={job.jobId}
                          className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                            job.reviewed && !editingReview ? "bg-gray-100" : ""
                          }`}
                          onClick={() => {
                            if (!job.reviewed || editingReview) {
                              setSelectedJob(job);
                            } else {
                              toast.info("You've already reviewed this job");
                            }
                          }}
                        >
                          <h3 className="font-medium">
                            {job.jobTitle || job.jobType} - {job.category}
                          </h3>
                          {job.reviewed && !editingReview ? (
                            <p className="text-sm text-gray-600">
                              Already reviewed: {job.reviewRating} stars
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob && (
                  <>
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="font-medium">
                          Rating for:{" "}
                          {selectedEmployer.employer.firstName ||
                            selectedEmployer.employer.companyName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Job: {selectedJob.jobTitle || selectedJob.jobType} -{" "}
                          {selectedJob.category}
                        </p>
                      </div>
                      <Button
                        color="primary"
                        variant="flat"
                        onClick={() => {
                          setSelectedJob(null);
                          if (editingReview) {
                            resetReviewForm();
                          }
                        }}
                      >
                        Change Job
                      </Button>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 font-medium">Rating</label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`h-8 w-8 cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                            onClick={() => handleRating(star)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <Textarea
                        label="Comment"
                        value={comment}
                        onValueChange={setComment}
                        className="w-full p-2 border rounded"
                        rows={4}
                        placeholder="Share your experience with this employer..."
                      />
                    </div>

                    <Button
                      onClick={handleSubmitReview}
                      disabled={
                        leaveReviewMutation.isLoading ||
                        editReviewMutation.isLoading
                      }
                      color="primary"
                    >
                      {leaveReviewMutation.isLoading ||
                      editReviewMutation.isLoading
                        ? "Submitting..."
                        : editingReview
                          ? "Update Review"
                          : "Submit Review"}
                    </Button>
                  </>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default ArtisanReviewsPage;
