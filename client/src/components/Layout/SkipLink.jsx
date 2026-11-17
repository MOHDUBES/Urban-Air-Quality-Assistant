import React, { useContext } from 'react';
import { LangContext } from '../../App';

export default function SkipLink() {
  const { t } = useContext(LangContext);
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-700 focus:text-white focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
    >
      {t.common.skipToMain}
    </a>
  );
}
