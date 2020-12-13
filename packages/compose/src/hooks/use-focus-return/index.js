/**
 * WordPress dependencies
 */
import { useRef, useCallback, useEffect } from '@wordpress/element';

/**
 * When opening modals/sidebars/dialogs, the focus
 * must move to the opened area and return to the
 * previously focused element when closed.
 * The current hook implements the returning behavior.
 *
 * @param {Function?} onFocusReturn Overrides the default return behavior.
 * @return {Function} Element Ref.
 *
 * @example
 * ```js
 * import { useFocusReturn } from '@wordpress/compose';
 *
 * const WithFocusReturn = () => {
 *     const ref = useFocusReturn()
 *     return (
 *         <div ref={ ref }>
 *             <Button />
 *             <Button />
 *         </div>
 *     );
 * }
 * ```
 */
function useFocusReturn( onFocusReturn ) {
	const ref = useRef();
	const focusedBeforeMount = useRef();
	const onFocusReturnRef = useRef( onFocusReturn );
	useEffect( () => {
		onFocusReturnRef.current = onFocusReturn;
	}, [ onFocusReturn ] );

	useEffect(
		() => () => {
			const isFocused = ref.current.contains(
				ref.current.ownerDocument.activeElement
			);

			if ( ! isFocused ) {
				return;
			}

			// Defer to the component's own explicit focus return behavior, if
			// specified. This allows for support that the `onFocusReturn`
			// decides to allow the default behavior to occur under some
			// conditions.
			if ( onFocusReturnRef.current ) {
				onFocusReturnRef.current();
			} else {
				focusedBeforeMount.current.focus();
			}
		},
		[]
	);

	// Once the node mounts, set the active element at that time.
	return useCallback( ( node ) => {
		ref.current = node;

		if ( ! node || focusedBeforeMount.current ) {
			return;
		}

		focusedBeforeMount.current = node.ownerDocument.activeElement;
	} );
}

export default useFocusReturn;
