"use client";
import Script from "next/script";
import { BsGlobe2 } from "react-icons/bs";
const Translator = () => {
  return (
    <div>
      <Script
        type="text/javascript"
        src={`https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`}
      />
      <Script id="google-translate">
        {`function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}`}
      </Script>
      <div className="transbox">
        <div className="transGroup">
          <span className="lang notranslate" id="lang">
            <BsGlobe2 />
          </span>
        </div>
        <div id="google_translate_element" className="translate"></div>
      </div>
    </div>
  );
};

export default Translator;
