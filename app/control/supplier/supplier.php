<?php
	require( '../../../server/config/db.php');
	require( '../../../server/ssp.class.php' );

	// DB table to use
	$table = 'view_supplier';

	// Table's primary key
	$primaryKey = 'id_supplier';

	// SQL server connection information
	$sql_details = array(
	    'user' => DB_USER,
	    'pass' => DB_PASS,
	    'db'   => DB_NAME,
	    'host' => DB_HOST
	);

// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database, while the `dt`
// parameter represents the DataTables column identifier. In this case simple
// indexes
$columns = array(
    array( 'db' => 'id_supplier', 'dt' => 0 ),
    array( 'db' => 'first_name', 'dt' => 1 ),
    array( 'db' => 'alamat', 'dt' => 2 ),
    array( 'db' => 'fk.id_branch', 'dt' => 3 ),
    array( 'db' => 'name', 'dt' => 4 ),
    array( 'db' => 'notes', 'dt' => 5 )
);
echo json_encode(
    SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
);

	//this is old script without server-side processing PHP plug-in
	/* $arr_data1 = array("draw: ".$_REQUEST["draw"], "start: ".$_REQUEST["start"], "length: ".$_REQUEST["length"], "search: ".$_REQUEST["search"]["value"], "search(regex): ".$_REQUEST["search"]["regex"]);
	$arr_data2 = array(6, 7, 8, 9, 10);
	$arr_data3 = array(11, 12, 13, 14, 15);
	$arr;
	$arr[] = $arr_data1;
	$arr[] = $arr_data2;
	$arr[] = $arr_data3;
	$data["tableData"] = $arr;
	echo json_encode($data); */
?>