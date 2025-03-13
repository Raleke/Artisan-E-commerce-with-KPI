import React, { useState } from "react";
import { useParams } from "react-router";
import { Button, Modal } from "@heroui/react";
import ArtisanProfile from "./ArtisanProfilePage";
// import { useEmployArtisan } from "../../hooks/employerHooks";

const UpdatedArtisanProfile = () => {
  const { jobId, artisanId } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  // const employMutation = useEmployArtisan();

  console.log(jobId, artisanId);
  const handleEmploy = () => {
    setModalOpen(true);
  };

  const handleReject = () => {
    setRejectModalOpen(true);
  };

  const confirmEmploy = async () => {
    // await employMutation.mutateAsync({ jobId, artisanId });
    setModalOpen(false);
    // Optionally navigate away or show a success message
  };

  const confirmReject = async () => {
    // Add reject logic here
    // await rejectMutation.mutateAsync({ jobId, artisanId });
    setRejectModalOpen(false);
    // Optionally navigate away or show a success message
  };

  return (
    <>
      <ArtisanProfile artisanId={artisanId} />
      {jobId && artisanId && (
        <div className="p-4 flex justify-end space-x-2">
          <Button color="danger" onClick={handleReject}>
            Reject Artisan
          </Button>
          <Button color="primary" onClick={handleEmploy}>
            Employ Artisan
          </Button>
        </div>
      )}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold">Confirm Employment</h2>
            <p>Are you sure you want to employ this artisan for job {jobId}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button color="danger" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onClick={confirmEmploy}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {isRejectModalOpen && (
        <Modal
          open={isRejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold">Confirm Rejection</h2>
            <p>Are you sure you want to reject this artisan for job {jobId}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                color="secondary"
                onClick={() => setRejectModalOpen(false)}
              >
                Cancel
              </Button>
              <Button color="danger" onClick={confirmReject}>
                Reject
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UpdatedArtisanProfile;
