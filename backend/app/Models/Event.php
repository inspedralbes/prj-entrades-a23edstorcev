<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'description', 'date', 'location'];
    public $incrementing = false;
    protected $keyType = 'string';

    public function seatCategories()
    {
        return $this->hasMany(SeatCategory::class);
    }
}
