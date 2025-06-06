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
  useEditReview,
  useLeaveReview,
  useGetCustomerProfile,
  useGetArtisansToRateCustomer,
} from "../adapters/Requests";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

const CustomerReviewsPage = () => {
  const { user } = useAuth();
  const { data: profileData, isLoading } = useGetCustomerProfile(user?.id);
  const { data: artisansToRate, isLoading: artisansLoading } =
    useGetArtisansToRateCustomer(user?.id);
  const leaveReviewMutation = useLeaveReview();
  const editReviewMutation = useEditReview();
  const deleteReviewMutation = useDeleteReview();
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmitReview = () => {
    if (!selectedArtisan || !selectedContact || rating === 0) {
      toast.error("Please select an artisan, contact, and provide a rating");
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
          reviewerType: "Customer",
          recipientId: selectedArtisan.artisan._id,
          recipientType: "Artisan",
          jobId: selectedContact.contactId,
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
    setSelectedArtisan(null);
    setSelectedContact(null);
    setRating(0);
    setComment("");
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment || "");

    // Find the corresponding artisan and contact
    const artisan = artisansToRate?.find(
      (a) => a.artisan._id === review.recipientId,
    );
    setSelectedArtisan(artisan);

    const contact = artisan?.contacts.find(
      (c) => c.contactId === review.contactId,
    );
    setSelectedContact(contact);

    setActiveTab("reviews");
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReviewMutation.mutate(reviewId);
    }
  };
  console.log(profileData);

  if (isLoading || artisansLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }
  console.log(artisansToRate);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Your Reviews</h2>
        </CardHeader>
        <CardBody>
          {profileData.customer?.reviews &&
          profileData.customer?.reviews.length > 0 ? (
            <div className="space-y-4">
              {profileData.customer?.reviews.map((review) => (
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
            {artisansLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : artisansToRate?.length === 0 ? (
              <p>No artisans to review at this time.</p>
            ) : (
              <>
                {!selectedArtisan && (
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">
                      Select an Artisan
                    </label>
                    <div className="space-y-2">
                      {artisansToRate?.map((item) => (
                        <div
                          key={item.artisan._id}
                          className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            setSelectedArtisan(item);
                            setSelectedContact(null);
                          }}
                        >
                          <h3 className="font-medium">
                            {item.artisan.firstName} {item.artisan.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.artisan.jobCategories[0]?.jobCategory || ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedArtisan && !selectedContact && (
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <label className="font-medium">Select a Contact</label>
                      <Button
                        color="primary"
                        onClick={() => setSelectedArtisan(null)}
                      >
                        Change Artisan
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedArtisan.contacts.map((contact) => (
                        <div
                          key={contact.contactId}
                          className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                            contact.reviewed && !editingReview
                              ? "bg-gray-100"
                              : ""
                          }`}
                          onClick={() => {
                            if (!contact.reviewed || editingReview) {
                              setSelectedContact(contact);
                            } else {
                              toast.info(
                                "You've already reviewed this contact",
                              );
                            }
                          }}
                        >
                          <h3 className="font-medium">
                            Contact Date:{" "}
                            {new Date(contact.contactDate).toLocaleDateString()}
                          </h3>
                          {contact.reviewed && !editingReview ? (
                            <p className="text-sm text-gray-600">
                              Already reviewed: {contact.reviewRating} stars
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedContact && (
                  <>
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="font-medium">
                          Rating for: {selectedArtisan.artisan.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Contact Date:{" "}
                          {new Date(
                            selectedContact.contactDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        color="primary"
                        variant="flat"
                        onClick={() => {
                          console.log(selectedContact);
                          setSelectedContact(null);
                          if (editingReview) {
                            resetReviewForm();
                          }
                        }}
                      >
                        Change Contact
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
                        placeholder="Share your experience with this artisan..."
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
export default CustomerReviewsPage;
