'use strict';
const styleTag = document.createElement('style');
async function getJsonData() {
	const res = await fetch('./data_sample.json');
	const data = await res.json();

	const arr = Object.entries(data.data);

	let root;
	let rootId;
	arr.forEach((el, index) => {
		const general = el.settings?.general;
		const className1 = el[1].settings?.className;
		if (el[1].parent === null) {
			root = document.createElement(el[1].componentName.toLowerCase());
			rootId = el[0];
			if (general) {
				root.classList.add(general.className);
			} else if (className1) {
				root.classList.add(className1);
			}
			styleTag.innerHTML += `
            .${root.classList[0]}{
               ${convertObjectToCustomPropertiesString(el[1].settings.style.mobile)}
            }

            @media only screen and (min-width: 575px){
               .${root.classList[0]}{
                  ${convertObjectToCustomPropertiesString(el[1].settings.style.tablet)}
               }
            }
            @media only screen and (min-width: 1024px){
               .${root.classList[0]}{
                  ${convertObjectToCustomPropertiesString(el[1].settings.style.desktop)}
               }
            }
         `;
		}
		if (el[1].parent === rootId) {
			// Creating and appending Children to parent element
			const element = document.createElement(el[1].componentName.toLowerCase());
			root.appendChild(element);
			// adding classNames
			if (general) {
				element.classList.add(general.className);
			} else if (className1) {
				element.classList.add(className1);
			}
			// Find child nodes and add them into the element
			getAndSetChildrens(element, el[1].nodes, arr);

			if (element.classList[0]) {
				styleTag.innerHTML += `
            .${element.classList[0]}{
               ${el[1].settings.style?.mobile && convertObjectToCustomPropertiesString(el[1].settings.style?.mobile)}
            }
            .${element.classList[0]}{
               ${
									el[1].settings?.general?.style?.mobile &&
									convertObjectToCustomPropertiesString(el[1].settings?.general?.style?.mobile)
								}
            }

            @media only screen and (min-width: 575px){
               .${element.classList[0]}{
                  ${el[1].settings.style?.tablet && convertObjectToCustomPropertiesString(el[1].settings.style.tablet)}
               }
               .${element.classList[0]}{
                  ${
										el[1].settings?.general?.style?.tablet &&
										convertObjectToCustomPropertiesString(el[1].settings?.general?.style?.tablet)
									}
               }
            }
            @media only screen and (min-width: 1024px){
               .${element.classList[0]}{
                  ${
										el[1].settings.style?.desktop && convertObjectToCustomPropertiesString(el[1].settings.style.desktop)
									}
               }
               .${element.classList[0]}{
                  ${
										el[1].settings?.general?.style?.desktop &&
										convertObjectToCustomPropertiesString(el[1].settings?.general?.style?.desktop)
									}
               }
            }
         `;
			} else {
				element.style.cssText += `
            
               ${el[1].settings.style?.mobile && convertObjectToCustomPropertiesString(el[1].settings.style?.mobile)}

               ${
									el[1].settings?.general?.style?.mobile &&
									convertObjectToCustomPropertiesString(el[1].settings?.general.style?.mobile)
								}
            

            @media only screen and (min-width: 575px){
               
                  ${el[1].settings.style?.tablet && convertObjectToCustomPropertiesString(el[1].settings.style.tablet)}
                  ${
										el[1].settings?.general?.style?.tablet &&
										convertObjectToCustomPropertiesString(el[1].settings?.general.style?.tablet)
									}
               
            }
            @media only screen and (min-width: 1024px){
               
                  ${
										el[1].settings.style?.desktop && convertObjectToCustomPropertiesString(el[1].settings.style.desktop)
									}

            ${
							el[1].settings?.general?.style?.desktop &&
							convertObjectToCustomPropertiesString(el[1].settings?.general.style?.desktop)
						}
               
            }
         `;
			}
		}
	});
	document.querySelector('#root').insertAdjacentElement('afterbegin', root);
	console.log(root);
}

function getAndSetChildrens(parent, nodes = [], arr = arr) {
	const nodeArr = nodes.map((node) => {
		const nodeObj = arr.find((n) => n[0] === node);

		return nodeObj[1];
	});
	nodeArr.forEach((el, index) => {
		const general = el.settings?.general;
		const className1 = el.settings?.className;
		// Creating and appending Children to parent element
		let element;
		if (general && general.headingType) {
			element = document.createElement(general.headingType);
			element.textContent = general.text;
		} else if (general && general.img) {
			element = document.createElement('img');
			element.src = general.img.src;
		} else if (el.componentName === 'Button') {
			element = document.createElement(el.componentName.toLowerCase());
			element.textContent = general.text;
		} else {
			element = document.createElement(el.componentName.toLowerCase());
		}
		parent.appendChild(element);
		// adding classNames
		if (general && general.className) {
			element.classList.add(general.className + index);
		} else if (general && general.icon) {
			element.classList.add(general.icon.type.split(' ')[0], general.icon.type.split(' ')[1]);
		} else if (className1) {
			element.classList.add(className1 + index);
		}

		getAndSetChildrens(element, el.nodes, arr);

		if (element.classList[0]) {
			styleTag.innerHTML += `
         .${element.classList[0]}{
            ${el.settings.style?.mobile && convertObjectToCustomPropertiesString(el.settings.style?.mobile)}
         }
         .${element.classList[0]}{
            ${
							el.settings.general?.style?.mobile &&
							convertObjectToCustomPropertiesString(el.settings.general.style?.mobile)
						}
         }
         
         @media only screen and (min-width: 575px){
            .${element.classList[0]}{
               ${el.settings.style?.tablet && convertObjectToCustomPropertiesString(el.settings.style.tablet)}
            }
            .${element.classList[0]}{
               ${
									el.settings.general?.style?.tablet &&
									convertObjectToCustomPropertiesString(el.settings.general.style?.tablet)
								}
            }
         }
         @media only screen and (min-width: 1024px){
            .${element.classList[0]}{
               ${el.settings.style?.desktop && convertObjectToCustomPropertiesString(el.settings.style.desktop)}
            }
            .${element.classList[0]}{
               ${
									el.settings.general?.style?.desktop &&
									convertObjectToCustomPropertiesString(el.settings.general.style?.desktop)
								}
            }
         }
         `;
		} else {
			element.style.cssText = `
         ${el.settings.style?.desktop && convertObjectToCustomPropertiesString(el.settings.style?.desktop)}
         ${
						el.settings.general?.style?.desktop &&
						convertObjectToCustomPropertiesString(el.settings.general.style?.desktop)
					}
         
         
        
         `;
		}
	});
}
(document.head || document.documentElement).appendChild(styleTag);

getJsonData();

// Formating style objects
const convertCamelCaseToDashes = (str, prefix = '') => {
	let s = [...str];
	s.map((l, i) => {
		if (l === l.toUpperCase() && isNaN(l)) {
			s[i] = '-' + l.toLowerCase();
		}
	});
	return `${prefix ? `${prefix}-` : ''}${s.join('')}`;
};

const isObject = (variable) => {
	return Object.prototype.toString.call(variable) === '[object Object]';
};

const convertObjectToCustomPropertiesObject = (obj, prefix = '') => {
	const toReturn = {};

	Object.entries(obj).map(([key, value]) => {
		const customPropertyName = convertCamelCaseToDashes(key, prefix);
		if (isObject(value)) {
			const flattenedValues = convertObjectToCustomPropertiesObject(value, customPropertyName);
			Object.entries(flattenedValues).map(([fCustomPropertyName, fValue]) => {
				toReturn[`${fCustomPropertyName}`] = fValue;
			});
		} else {
			toReturn[`${customPropertyName}`] = value;
		}
	});

	return toReturn;
};

const convertObjectToCustomPropertiesString = (obj, prefix = '') => {
	let toReturn = '';

	const asObject = convertObjectToCustomPropertiesObject(obj, prefix);

	for (let [key, value] of Object.entries(asObject)) {
		toReturn += `${key}: ${value};
`;
	}

	return toReturn.trim();
};
