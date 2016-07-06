'use strict';

import Component from '../src/Component';
import ComponentDataManager from '../src/ComponentDataManager';
import State from 'metal-state';

describe('ComponentDataManager', function() {
	var component;
	var manager;
	afterEach(function() {
		manager.dispose();
		component.dispose();
	});

	it('should add the specified properties to the given component', function() {
		component = new Component();
		manager = new ComponentDataManager(component, {
			foo: {
				value: 'fooValue'
			}
		});

		assert.strictEqual('fooValue', component.foo);
	});

	it('should use component\'s config as initial state values', function() {
		component = new Component({
			foo: 'initialFoo'
		});
		manager = new ComponentDataManager(component, {
			foo: {
			}
		});

		assert.strictEqual('initialFoo', component.foo);
	});

	it('should throw error if attempting to add state property named "element"', function() {
		component = new Component();
		assert.throws(() => {
			manager = new ComponentDataManager(component, {
				element: {
				}
			});
		});
	});

	it('should add the state properties defined in STATE to the given component', function() {
		class TestComponent extends Component {
		}
		TestComponent.STATE = {
			foo: {
				value: 'fooValue'
			}
		};

		component = new TestComponent();
		manager = new ComponentDataManager(component, {});

		assert.strictEqual('fooValue', component.foo);
	});

	it('should return state instance', function() {
		component = new Component();
		manager = new ComponentDataManager(component, {});
		assert.ok(manager.getStateInstance() instanceof State);
	});

	it('should return an object with state properties', function() {
		component = new Component();
		manager = new ComponentDataManager(component, {
			foo: {
				value: 'fooValue'
			}
		});

		var expected = {
			foo: 'fooValue'
		};
		assert.deepEqual(expected, manager.getState());
	});

	it('should return list of state keys', function() {
		component = new Component();
		manager = new ComponentDataManager(component, {
			foo: {
				value: 'fooValue'
			}
		});

		assert.deepEqual(['foo'], manager.getStateKeys());
	});

	it('should get value from state key', function() {
		component = new Component();
		manager = new ComponentDataManager(component, {
			foo: {
				value: 'fooValue'
			}
		});

		assert.strictEqual('fooValue', manager.get('foo'));
	});

	it('should set value for state key', function() {
		component = new Component();
		manager = new ComponentDataManager(component, {
			foo: {
				value: 'fooValue'
			}
		});

		manager.setState({
			foo: 'fooValue2'
		});
		assert.strictEqual('fooValue2', component.foo);
	});

	it('should emit events from state on component', function() {
		component = new Component();
		manager = new ComponentDataManager(component, {
			foo: {
				value: 'fooValue'
			}
		});

		var listener = sinon.stub();
		component.on('fooChanged', listener);

		component.foo = 'fooValue2';
		assert.strictEqual(1, listener.callCount);
		assert.strictEqual('fooValue2', listener.args[0][0].newVal);
	});
});