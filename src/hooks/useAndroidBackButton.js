import { useEffect, useRef, useState } from 'react';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Custom hook to handle Android hardware & gesture back button in Capacitor.
 * Ensures modals, sheets, drawers, searches, and filters close on back press
 * rather than unexpectedly terminating the entire app.
 */
export function useAndroidBackButton({
  isDrawerOpen,
  closeDrawer,
  activePolicy,
  closePolicy,
  invoiceOrder,
  closeInvoice,
  completedOrder,
  closeSuccess,
  isFeedbackModalOpen,
  closeFeedback,
  isAuthModalOpen,
  closeAuth,
  isCheckoutOpen,
  closeCheckout,
  selectedProduct,
  closeProduct,
  isCartOpen,
  closeCart,
  searchQuery,
  clearSearch,
  selectedCategory,
  resetCategory,
  isAdminMode,
  exitAdminMode
}) {
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressRef = useRef(0);
  const toastTimeoutRef = useRef(null);

  // Store current state in a ref so back button listener always gets latest values
  const stateRef = useRef({
    isDrawerOpen,
    activePolicy,
    invoiceOrder,
    completedOrder,
    isFeedbackModalOpen,
    isAuthModalOpen,
    isCheckoutOpen,
    selectedProduct,
    isCartOpen,
    searchQuery,
    selectedCategory,
    isAdminMode
  });

  useEffect(() => {
    stateRef.current = {
      isDrawerOpen,
      activePolicy,
      invoiceOrder,
      completedOrder,
      isFeedbackModalOpen,
      isAuthModalOpen,
      isCheckoutOpen,
      selectedProduct,
      isCartOpen,
      searchQuery,
      selectedCategory,
      isAdminMode
    };
  }, [
    isDrawerOpen,
    activePolicy,
    invoiceOrder,
    completedOrder,
    isFeedbackModalOpen,
    isAuthModalOpen,
    isCheckoutOpen,
    selectedProduct,
    isCartOpen,
    searchQuery,
    selectedCategory,
    isAdminMode
  ]);

  useEffect(() => {
    // Only register on native platforms (Android / iOS)
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const backButtonListenerPromise = CapApp.addListener('backButton', () => {
      const state = stateRef.current;

      // 1. Close Side Menu / Drawer if open
      if (state.isDrawerOpen && closeDrawer) {
        closeDrawer();
        return;
      }

      // 2. Close Policy Modal if open
      if (state.activePolicy && closePolicy) {
        closePolicy();
        return;
      }

      // 3. Close Invoice Modal if open
      if (state.invoiceOrder && closeInvoice) {
        closeInvoice();
        return;
      }

      // 4. Close Order Success Modal if open
      if (state.completedOrder && closeSuccess) {
        closeSuccess();
        return;
      }

      // 5. Close Feedback Modal if open
      if (state.isFeedbackModalOpen && closeFeedback) {
        closeFeedback();
        return;
      }

      // 6. Close User Account / Orders Modal if open
      if (state.isAuthModalOpen && closeAuth) {
        closeAuth();
        return;
      }

      // 7. Close Checkout Modal if open
      if (state.isCheckoutOpen && closeCheckout) {
        closeCheckout();
        return;
      }

      // 8. Close Product Details Modal if open
      if (state.selectedProduct && closeProduct) {
        closeProduct();
        return;
      }

      // 9. Close Cart Drawer if open
      if (state.isCartOpen && closeCart) {
        closeCart();
        return;
      }

      // 10. Exit Admin Mode back to Storefront if active
      if (state.isAdminMode && exitAdminMode) {
        exitAdminMode();
        return;
      }

      // 11. Clear active search query if present
      if (state.searchQuery && clearSearch) {
        clearSearch();
        return;
      }

      // 12. Reset filtered category to 'All' if filtered
      if (state.selectedCategory !== 'All' && resetCategory) {
        resetCategory();
        return;
      }

      // 13. At root of app: Double-press back within 2 seconds to exit app
      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        CapApp.exitApp();
      } else {
        lastBackPressRef.current = now;
        setShowExitToast(true);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
          setShowExitToast(false);
        }, 2000);
      }
    });

    return () => {
      backButtonListenerPromise.then((handle) => handle.remove());
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  return { showExitToast };
}
