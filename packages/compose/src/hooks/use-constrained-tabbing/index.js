/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { TAB } from '@wordpress/keycodes';
import { focus } from '@wordpress/dom';

/**
 * In Dialogs/modals, the tabbing must be constrained to the content of
 * the wrapper element. This hook adds the behavior to the returned ref.
 *
 * @return {Object|Function} Element Ref.
 *
 * @example
 * ```js
 * import { useConstrainedTabbing } from '@wordpress/compose';
 *
 * const ConstrainedTabbingExample = () => {
 *     const constrainedTabbingRef = useConstrainedTabbing()
 *     return (
 *         <div ref={ constrainedTabbingRef }>
 *             <Button />
 *             <Button />
 *         </div>
 *     );
 * }
 * ```
 */
function useConstrainedTabbing() {
	return useCallback( ( node ) => {
		if ( ! node ) {
			return;
		}

		node.addEventListener( 'keydown', ( event ) => {
			if ( event.keyCode !== TAB ) {
				return;
			}

			const tabbables = focus.tabbable.find( node );
			if ( ! tabbables.length ) {
				return;
			}
			const firstTabbable = tabbables[ 0 ];
			const lastTabbable = tabbables[ tabbables.length - 1 ];

			if ( event.shiftKey && event.target === firstTabbable ) {
				event.preventDefault();
				lastTabbable.focus();
			} else if ( ! event.shiftKey && event.target === lastTabbable ) {
				event.preventDefault();
				firstTabbable.focus();
				/*
				 * When pressing Tab and none of the tabbables has focus, the keydown
				 * event happens on the wrapper div: move focus on the first tabbable.
				 */
			} else if ( ! tabbables.includes( event.target ) ) {
				event.preventDefault();
				firstTabbable.focus();
			}
		} );
	}, [] );
}

export default useConstrainedTabbing;
