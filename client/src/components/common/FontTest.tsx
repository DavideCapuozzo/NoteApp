import React from 'react';

const FontTest = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>H1 - General Sans Bold</h1>
        <h2>H2 - General Sans Semibold</h2>
        <h3>H3 - General Sans Semibold</h3>
        <h4>H4 - General Sans Medium</h4>
        <h5>H5 - General Sans Medium</h5>
        <h6>H6 - General Sans Medium</h6>
      </div>
      
      <div>
        <p>Questo è un paragrafo con Quicksand Regular. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p className="font-medium">Questo è un paragrafo con Quicksand Medium.</p>
        <p className="font-semibold">Questo è un paragrafo con Quicksand Semibold.</p>
        <p className="font-bold">Questo è un paragrafo con Quicksand Bold.</p>
      </div>

      <div>
        <div className="font-heading text-2xl font-bold">Testo con classe .font-heading</div>
        <div className="font-body text-lg">Testo con classe .font-body</div>
      </div>

      <div>
        <span style={{ fontFamily: 'General Sans, sans-serif', fontSize: '24px', fontWeight: 'bold' }}>
          Test inline General Sans
        </span>
        <br />
        <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '18px' }}>
          Test inline Quicksand
        </span>
      </div>
    </div>
  );
};

export default FontTest;
