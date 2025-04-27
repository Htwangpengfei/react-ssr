import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import {Index} from 'web/index';
import React from 'react';
import {findRoute} from 'web/router/findRoute';

export async function serverRender(path) {
	const router = findRoute(path);
	const res = await router.fetch();
	if (router) {
		const content = renderToString(
			<StaticRouter location={router.path} context={{
				initData: res
			}}>
				<Index />
			</StaticRouter>
		);
		return {
			content,
			state: res
		}
	}
}
