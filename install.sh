#!/usr/bin/env bash

source settings.cfg
params=( parse_application_name parse_app_domain parse_app_id parse_master_key parse_js_key app_url webhooks_auth_login webhooks_auth_password )
build_dir="`dirname $0`/build"
rm -rf $build_dir

for file in `find ./ -type f -regex ".+\.js\(on\)*"`; do
	dest_file="$build_dir/$file"
	mkdir -p "$build_dir/`dirname $file`"
	cp $file $dest_file
	for param in "${params[@]}"
	do
		sed -i "s=\[$param\]=${!param}=g" $dest_file
	done
done
