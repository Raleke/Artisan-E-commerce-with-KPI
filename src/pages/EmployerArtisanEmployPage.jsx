import React, { useState } from "react";
import { useParams } from "react-router";
import {
  Button,
  Modal,
  useDisclosure,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import ArtisanProfile from "./ArtisanProfilePage";
import { usePatchApplicationStatus } from "../adapters/Requests";
// import { useEmployArtisan } from "../../hooks/employerHooks";

const UpdatedArtisanProfile = () => {
  const { jobId, artisanId } = useParams();
  const {
    isOpen: isEmployModalOpen,
    onOpen: onEmployOpen,
    onOpenChange: onEmployOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRejectModalOpen,
    onOpen: onRejectOpen,
    onOpenChange: onRejectOpenChange,
  } = useDisclosure();
  const patchApplicationStatus = usePatchApplicationStatus(jobId, artisanId);

  console.log(jobId, artisanId);

  const confirmEmploy = async () => {
    await patchApplicationStatus.mutateAsync({ status: "Employed" });
    onEmployOpenChange(false);
    // Optionally navigate away or show a success message
  };

  const confirmReject = async () => {
    await patchApplicationStatus.mutateAsync({ status: "Rejected" });
    onRejectOpenChange(false);
    // Optionally navigate away or show a success message
  };

  return (
    <>
      <ArtisanProfile artisanId={artisanId} isOwnProfile={false} />

      {jobId && artisanId && (
        <div className="p-4 flex justify-end space-x-2">
          <Button color="danger" onPress={onRejectOpen}>
            Reject Artisan
          </Button>
          <Button color="primary" onPress={onEmployOpen}>
            Employ Artisan
          </Button>
        </div>
      )}

      <Modal isOpen={isEmployModalOpen} onOpenChange={onEmployOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Employment
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to employ this artisan for job {jobId}?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={confirmEmploy}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isRejectModalOpen} onOpenChange={onRejectOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Rejection
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to reject this artisan for job {jobId}?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={confirmReject}>
                  Reject
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatedArtisanProfile;
