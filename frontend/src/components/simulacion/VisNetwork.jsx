import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";

const VisNetwork = ({ dot }) => {
	const visJsRef = useRef(null);

	useEffect(() => {
		if (visJsRef.current) {
			const options = {
				nodes: {
					color: {
						border: 'black',
						background: 'blue',

					},
				}

			};
			const network = new Network(visJsRef.current, { dot }, options);
			// Utiliza `network` aquí para configurar eventos, etc.
		}
	}, [visJsRef, dot]); // Agrega dot como dependencia

	return <div ref={visJsRef}></div>;
};

export default VisNetwork;
