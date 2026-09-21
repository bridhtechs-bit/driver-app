import { useState, useCallback } from "react";

export type FeedbackVariant =
  | "success"
  | "error"
  | "info";

export function useDeliveryFeedback() {

  const [feedback, setFeedback] =
    useState<string | null>(null);

  const [feedbackVariant, setFeedbackVariant] =
    useState<FeedbackVariant>("info");

  const showSuccess =
    useCallback((message: string) => {

      setFeedback(message);

      setFeedbackVariant("success");

    }, []);

  const showError =
    useCallback((message: string) => {

      setFeedback(message);

      setFeedbackVariant("error");

    }, []);

  const showInfo =
    useCallback((message: string) => {

      setFeedback(message);

      setFeedbackVariant("info");

    }, []);

  const clearFeedback =
    useCallback(() => {

      setFeedback(null);

    }, []);

  return {

    feedback,

    feedbackVariant,

    showSuccess,

    showError,

    showInfo,

    clearFeedback,

  };

}